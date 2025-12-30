import { Controller, Get, Delete, Param, UseGuards, ParseIntPipe, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    @Get()
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    async findAll() {
        this.logger.log('Fetching all users');
        return this.usersService.findAll();
    }

    @Delete(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Deleting user ID ${id}`);
        return this.usersService.remove(id);
    }
}
