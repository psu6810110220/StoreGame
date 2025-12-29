import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- 1. เพิ่มตัวนี้
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 2. ใส่ ConfigModule ไว้บนสุด เพื่อให้อ่าน .env ได้
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    // server/src/app.module.ts

TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
  
  // 👇 แก้ 3 บรรทัดนี้ให้ดึงจาก .env เท่านั้น (ไม่ต้องมี || 'postgres')
  username: process.env.DATABASE_USER, 
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  
  autoLoadEntities: true,
  synchronize: true,
}),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}