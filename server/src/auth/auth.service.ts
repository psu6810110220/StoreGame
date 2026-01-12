import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        const existingUser = await this.usersService.findOneByUsername(registerUserDto.username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        if (registerUserDto.email) {
            const existingEmail = await this.usersService.findOneByEmail(registerUserDto.email);
            if (existingEmail) {
                throw new ConflictException('Email already exists');
            }
        }

        const newUser = await this.usersService.create(registerUserDto);
        const { password, ...result } = newUser;
        return result;
    }

    async validateUser(identity: string, pass: string): Promise<any> {
        // 1. ค้นหาผู้ใช้จาก username ก่อน
        // บรรทัดนี้คือการ "ค้นหา" ว่ามีคนชื่อนี้ไหม?
        let user = await this.usersService.findOneByUsername(identity);
        console.log(`[AuthDebug] Finding user by username '${identity}':`, user ? 'Found' : 'Not Found');

        // 2. ถ้าไม่เจอ ให้ลองหาจาก email (Allow login by email)
        if (!user) {
            user = await this.usersService.findOneByEmail(identity);
            console.log(`[AuthDebug] Finding user by email '${identity}':`, user ? 'Found' : 'Not Found');
        }

        // ถ้าหาไม่เจอเลยทั้งคู่ -> จบข่าว
        if (!user) {
            console.log('[AuthDebug] User not found in DB');
            return null;
        }

        // 3. ตรวจสอบรหัสผ่านด้วย bcrypt
        // bcrypt.compare() จะเอารหัสที่กรอก (pass) ไปเข้าสูตร แล้วเทียบกับรหัสลับ ($2b$10$...) ในฐานข้อมูล
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`[AuthDebug] Password check for '${user.username}':`, isMatch ? 'MATCH ✅' : 'MISMATCH ❌');

        // 4. ถ้าคนถูกต้อง และรหัสถูกต้อง
        if (user && isMatch) {
            // ตัดรหัสผ่านทิ้งก่อนส่งกลับ (เพื่อความปลอดภัย ไม่ควรส่ง password วนไปมา)
            const { password, ...result } = user;
            return result;
        }
        return null; // ถ้าไม่ถูก ให้บอกว่า "ไม่มีตัวตน" หรือ "รหัสผิด"
    }

    async login(loginUserDto: LoginUserDto) {
        // 1. ตรวจสอบข้อมูลล็อกอิน (เรียกใช้ฟังก์ชัน validateUser ข้างบน)
        const user = await this.validateUser(loginUserDto.identity, loginUserDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials'); // ถ้าไม่ผ่าน ให้เด้ง Error 401
        }

        // 2. สร้าง Payload (ไส้ในของ Token)
        // ข้อมูลนี้จะถูกฝังอยู่ใน Access Token
        const payload = {
            username: user.username,
            sub: user.id,   // sub = Subject (มักใช้เก็บ ID)
            role: user.role // 🔑 ใส่ role มาด้วย เพื่อให้ Frontend เช็คได้ว่าเป็น Admin หรือไม่
        };

        // 3. ส่งข้อมูลกลับไปให้หน้าบ้าน (Frontend)
        // sign() คือการ "เซ็นชื่อกำกับ" เพื่อสร้าง Token ที่ปลอมแปลงไม่ได้
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                role: user.role // 👈 ส่งค่า role กลับไปให้ AuthContext เก็บใน localStorage
            }
        };
    }
}