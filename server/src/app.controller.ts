import { Controller, Get, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { extname, join } from 'path';
import { writeFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    }

    const uploadsDir = join(__dirname, '..', 'uploads');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    const fullPath = join(uploadsDir, filename);

    writeFileSync(fullPath, file.buffer);

    return { url: `http://localhost:3000/uploads/${filename}` };
  }
}
