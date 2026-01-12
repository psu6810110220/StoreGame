import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { RegisterUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        // ทำงานทันทีเมื่อ Module นี้ถูกโหลด (Server Start)
        // ใช้สำหรับสร้าง Admin คนแรกของระบบ ถ้ายังไม่มี
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const adminUsername = 'superadmin';
        const adminRawPassword = 'admin1234'; // รหัสผ่านตั้งต้น

        // 1. เช็คว่ามี username 'superadmin' หรือยัง?
        const adminExists = await this.findOneByUsername(adminUsername);

        if (!adminExists) {
            // 2. ถ้ายังไม่มี -> สร้างใหม่
            // เข้ารหัสรหัสผ่าน (Hashing) ก่อนลง Database เพื่อความปลอดภัย
            const hashedPassword = await bcrypt.hash(adminRawPassword, 10);

            const admin = this.usersRepository.create({
                username: adminUsername,
                password: hashedPassword,
                email: 'admin@game.com',
                role: UserRole.ADMIN, // 🔑 กำหนดสิทธิ์เป็น ADMIN
                firstName: 'System',
                lastName: 'Administrator'
            });

            await this.usersRepository.save(admin);
            console.log('🚀 [Seed] Admin user created: superadmin / admin1234');
        } else {
            // 3. ถ้ามีแล้ว -> อัปเดตรหัสผ่านและ Role ให้ถูกต้อง (กันพลาด)
            // เผื่อเราเปลี่ยนรหัสใน Code จะได้อัปเดตตามไปเลยตอนรันใหม่
            const hashedPassword = await bcrypt.hash(adminRawPassword, 10);
            adminExists.password = hashedPassword;
            adminExists.role = UserRole.ADMIN;
            await this.usersRepository.save(adminExists);
            console.log('✅ [Seed] Admin account updated with current password.');
        }
    }

    // ฟังก์ชันสร้าง User ใหม่ (Register)
    async create(createUserDto: RegisterUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;

        // 🔐 เข้ารหัสรหัสผ่านก่อนเก็บเสมอ
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
            role: UserRole.USER // ผู้ใช้ใหม่จะเป็น USER ปกติเสมอ
        });

        // บันทึกลงฐานข้อมูล
        return this.usersRepository.save(newUser);
    }

    // ดึงรายชื่อ User ทั้งหมด (ไม่เอา password)
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'username', 'email', 'role', 'firstName', 'lastName']
        });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    // ค้นหาด้วย Username (ใช้ตอน Login)
    async findOneByUsername(username: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { username } });

        // [Debug] แสดงผลใน Terminal เพื่อดูว่าเจอใครไหม
        if (user) {
            console.log(`🔎 DB Check -> User: ${user.username}, Role: ${user.role}`);
        }

        return user;
    }

    // ค้นหาด้วย Email
    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}