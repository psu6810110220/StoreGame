import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity'; //
import { RegisterUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        // เมื่อเซิร์ฟเวอร์รัน จะทำการเช็คและสร้าง Admin ทันที
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const adminUsername = 'superadmin';
        const adminRawPassword = 'admin1234'; // ✅ รหัสผ่านที่คุณต้องการ

        // 1. เช็คว่ามี username นี้อยู่ในฐานข้อมูลหรือยัง
        const adminExists = await this.findOneByUsername(adminUsername);

        if (!adminExists) {
            // 2. ถ้ายังไม่มี ให้ทำการ Hash รหัสผ่านใหม่
            const hashedPassword = await bcrypt.hash(adminRawPassword, 10);

            const admin = this.usersRepository.create({
                username: adminUsername,
                password: hashedPassword,
                email: 'admin@game.com',
                role: UserRole.ADMIN, // ✅ ต้องเป็นค่า 'admin' ตามที่กำหนดใน Entity
                firstName: 'System',
                lastName: 'Administrator'
            });

            await this.usersRepository.save(admin);
            console.log('🚀 [Seed] Admin user created: superadmin / admin1234'); //
        } else {
            // Force update password to ensure it matches hardcoded credentials
            const hashedPassword = await bcrypt.hash(adminRawPassword, 10);
            adminExists.password = hashedPassword;
            adminExists.role = UserRole.ADMIN;
            await this.usersRepository.save(adminExists);
            console.log('✅ [Seed] Admin account updated with current password.');
        }
    }

    async create(createUserDto: RegisterUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
            role: UserRole.USER // กำหนดค่าเริ่มต้นเป็น user
        });

        return this.usersRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'username', 'email', 'role', 'firstName', 'lastName'] // Exclude password
        });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async findOneByUsername(username: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { username } });

        // 🔍 [Debug] ช่วยตรวจสอบผ่าน Terminal ว่าข้อมูลจาก DB เป็นอย่างไร
        if (user) {
            console.log(`🔎 DB Check -> User: ${user.username}, Role: ${user.role}`);
        }

        return user;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}