import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Logger } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

// ควบคุมเส้นทาง /games
// ทุก Endpoint ในนี้ต้องผ่านด่าน User ปกติก่อน (JwtAuthGuard)
// และต้องผ่านด่านเช็คตำแหน่ง (RolesGuard) ถ้ามีการระบุ @Roles
@Controller('games')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamesController {
    private readonly logger = new Logger(GamesController.name);

    constructor(private readonly gamesService: GamesService) { }

    // สร้างเกมใหม่ (เฉพาะ Admin เท่านั้น)
    // POST /games
    @Post()
    @Roles(UserRole.ADMIN) // 🔒 จำกัดสิทธิ์ Admin
    create(@Body() createGameDto: CreateGameDto) {
        this.logger.log(`Creating Game: ${JSON.stringify(createGameDto)}`);
        return this.gamesService.create(createGameDto);
    }

    // ดูรายชื่อเกมทั้งหมด (ทุกคนดูได้ ขอแค่ Login)
    // GET /games
    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    // ดูรายละเอียดเกมรายตัว
    // GET /games/:id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gamesService.findOne(id);
    }

    // แก้ไขข้อมูลเกม (เฉพาะ Admin)
    // PATCH /games/:id
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
        this.logger.log(`Updating Game ID ${id}: ${JSON.stringify(updateGameDto)}`);
        return this.gamesService.update(id, updateGameDto);
    }

    // ลบเกม (เฉพาะ Admin)
    // DELETE /games/:id
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Deleting Game ID ${id}`);
        return this.gamesService.remove(id);
    }
}
