import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เพิ่มบรรทัดนี้ครับ เพื่ออนุญาตให้ Frontend ยิงเข้ามาได้
  app.enableCors({
    origin: 'http://localhost:5173', // หรือใส่ true เพื่อให้เข้าได้หมด
    credentials: true,
  });

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000);
}
bootstrap();