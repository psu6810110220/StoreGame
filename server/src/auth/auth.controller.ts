import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../users/user.entity';

// 1. กำหนด path หลักของ Controller นี้คือ /auth
// เช่น http://localhost:3000/auth
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // 2. สมัครสมาชิก (Register)
    // Post: /auth/register
    // รับข้อมูลจาก Body มาเป็น RegisterUserDto (username, password, email, etc.)
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    // 3. เข้าสู่ระบบ (Login)
    // Post: /auth/login
    // HttpCode(200): ถ้าสำเร็จให้ส่ง Code 200 OK (ปกติ Post จะส่ง 201 Created)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    // 4. ดูข้อมูลส่วนตัว (Get Profile)
    // Get: /auth/profile
    // UseGuards(JwtAuthGuard): ต้องมี Token เท่านั้นถึงจะเข้าได้ (Protected Route)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        // req.user มาจากการที่ JwtStrategy แกะป้ายชื่อ (Token) แล้วแนบข้อมูล User มาให้
        return req.user;
    }
}
