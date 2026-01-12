import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ยาม (Guard) สำหรับป้องกัน Route
// เรียกใช้ 'jwt' strategy ที่เราตั้งค่าไว้ใน JwtStrategy
// ถ้าไม่มี Token หรือ Token ปลอม ยามจะดีดออก (401 Unauthorized)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
