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
        // ค้นหาผู้ใช้จาก username ก่อน
        let user = await this.usersService.findOneByUsername(identity);
        console.log(`[AuthDebug] Finding user by username '${identity}':`, user ? 'Found' : 'Not Found');

        // ถ้าไม่เจอ ให้ลองหาจาก email
        if (!user) {
            user = await this.usersService.findOneByEmail(identity);
            console.log(`[AuthDebug] Finding user by email '${identity}':`, user ? 'Found' : 'Not Found');
        }

        if (!user) {
            console.log('[AuthDebug] User not found in DB');
            return null;
        }

        // ตรวจสอบรหัสผ่านด้วย bcrypt
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`[AuthDebug] Password check for '${user.username}':`, isMatch ? 'MATCH ✅' : 'MISMATCH ❌');

        if (user && isMatch) {
            // คืนค่า user ออกไป รวมถึงฟิลด์ role ด้วย
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        // 1. ตรวจสอบข้อมูลล็อกอิน
        const user = await this.validateUser(loginUserDto.identity, loginUserDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials'); //
        }

        // 2. สร้าง Payload โดยเน้นย้ำว่าต้องมี 'role' เพื่อให้ Guard และ Dashboard ทำงานได้
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role // 🔑 ค่านี้จะถูกถอดรหัสออกมาในหน้าบ้าน
        };

        // 3. ส่งข้อมูลกลับไปให้หน้าบ้าน (Frontend)
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