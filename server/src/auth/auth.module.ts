import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // ถ้ายังไม่มีไฟล์นี้ให้คอมเมนต์บรรทัดนี้ออกก่อน

@Module({
  imports: [
    UsersModule, // ต้อง Import UsersModule เพื่อให้สมัครสมาชิกได้
    PassportModule,
    JwtModule.register({
      secret: 'mySuperSecretKey123', // หรือใช้ process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController], // <--- บรรทัดนี้สำคัญมาก! ถ้าไม่มี Server จะไม่รู้จัก Link
  providers: [AuthService, JwtStrategy], // ใส่ JwtStrategy ถ้ามี
  exports: [AuthService],
})
export class AuthModule {}