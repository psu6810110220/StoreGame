import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// กำหนดหน้าตาของข้อมูลใน Token (Payload)
interface JwtPayload {
    sub: string;      // User ID (มาตรฐาน JWT ใช้ sub)
    username: string; // ชื่อผู้ใช้
    role: string;     // สิทธิ์ผู้ใช้ (admin/user)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            // 1. วิธีดึง Token: ดึงจาก Header ที่ชื่อ Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // 2. หมดอายุแล้วรับไหม?: false = ไม่รับ (ต้อง login ใหม่), true = รับ (ไม่ปลอดภัยแต่สะดวกตอน dev)
            ignoreExpiration: true,

            // 3. กุญแจลับสำหรับถอดรหัส: ต้องตรงกับตอน Sign Token (ใน AuthService)
            secretOrKey: configService.get<string>('JWT_SECRET') || 'YOUR_SECRET_KEY',
        });
    }

    // ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อ Token ถูกตรวจสอบว่า "ถูกต้อง" และ "มีลายเซ็นจริง"
    async validate(payload: JwtPayload) {
        // payload คือข้อมูลที่แกะออกมาจาก Token
        if (!payload.sub || !payload.username) {
            throw new UnauthorizedException('ข้อมูลใน Token ไม่สมบูรณ์');
        }

        // ส่งคืนข้อมูลผู้ใช้ -> NestJS จะเอาไปแปะใน request.user ให้ Controller ใช้ต่อ
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role // 🔑 สำคัญ: ส่ง Role ไปให้ Guard ตรวจสอบสิทธิ์ต่อ
        };
    }
}
