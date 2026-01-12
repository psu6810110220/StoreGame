import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gamesRepository: Repository<Game>,
    ) { }

    // สร้างเกมใหม่ ลง Database
    async create(createGameDto: CreateGameDto): Promise<Game> {
        const game = this.gamesRepository.create(createGameDto);
        return this.gamesRepository.save(game);
    }

    // ดึงข้อมูลเกมทั้งหมด
    async findAll(): Promise<Game[]> {
        return this.gamesRepository.find();
    }

    // ค้นหาเกมตาม ID
    async findOne(id: number): Promise<Game> {
        const game = await this.gamesRepository.findOne({ where: { id } });
        if (!game) {
            // ถ้าหาไม่เจอ ให้โยน Error 404 ออกไป
            throw new NotFoundException(`Game with ID ${id} not found`);
        }
        return game;
    }

    // อัปเดตข้อมูลเกม
    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
        // ต้องเช็คก่อนว่ามีเกมนี้ไหม? (เรียกใช้ฟังก์ชัน findOne ข้างบน)
        const game = await this.findOne(id);

        // เอาข้อมูลใหม่ (updateGameDto) ไปทับข้อมูลเก่า (game)
        const updatedGame = Object.assign(game, updateGameDto);
        return this.gamesRepository.save(updatedGame);
    }

    // ลบเกม
    async remove(id: number): Promise<void> {
        const result = await this.gamesRepository.delete(id);
        // เช็คว่ามีแถวที่ถูกลบจริงไหม?
        if (result.affected === 0) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }
    }
}
