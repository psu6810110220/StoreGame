import { Controller, Get, Delete, Param, UseGuards, ParseIntPipe, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// จัดการเกี่ยวกับ User (ดูข้อมูล, ลบ)
// เข้าถึงได้เฉพาะคนมี Token (@UseGuards(JwtAuthGuard))
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    // ดึงข้อมูล User ทั้งหมด
    // GET: /users
    @Get()
    async findAll() {
        this.logger.log('Fetching all users');
        return this.usersService.findAll();
    }

    // ลบ User ตาม ID
    // DELETE: /users/1
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Deleting user ID ${id}`);
        return this.usersService.remove(id);
    }
}
