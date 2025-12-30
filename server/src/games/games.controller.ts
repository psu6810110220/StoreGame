import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Logger } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../users/user.entity';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
    private readonly logger = new Logger(GamesController.name);

    constructor(private readonly gamesService: GamesService) { }

    @Post()
    // @Roles(UserRole.ADMIN)
    create(@Body() createGameDto: CreateGameDto) {
        this.logger.log(`Creating Game: ${JSON.stringify(createGameDto)}`);
        return this.gamesService.create(createGameDto);
    }

    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gamesService.findOne(id);
    }

    @Patch(':id')
    // @Roles(UserRole.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
        this.logger.log(`Updating Game ID ${id}: ${JSON.stringify(updateGameDto)}`);
        return this.gamesService.update(id, updateGameDto);
    }

    @Delete(':id')
    // @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Deleting Game ID ${id}`);
        return this.gamesService.remove(id);
    }
}
