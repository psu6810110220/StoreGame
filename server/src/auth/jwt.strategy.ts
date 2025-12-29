import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

interface JwtPayload {
    sub: string;      // User ID
    username: string;
    role: string;     // สิทธิ์ผู้ใช้ (admin/user)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // 1. ดึง Token จาก Header (Bearer Token)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // 2. ตั้งเป็น true เพื่อให้ข้ามการเช็คเวลาหมดอายุ (ตามที่คุณต้องการ)
            ignoreExpiration: true,

            // 3. ใช้ Secret Key จาก .env (ถ้าไม่มีให้ใช้ค่าสำรอง)
            secretOrKey: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload.sub || !payload.username) {
            throw new UnauthorizedException('ข้อมูลใน Token ไม่สมบูรณ์');
        }

        // ส่งคืนข้อมูลผู้ใช้ เพื่อให้ Guard และ Controller ใช้งานต่อได้
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role
        };
    }
}
