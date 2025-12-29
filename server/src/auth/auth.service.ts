import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        const existingUser = await this.usersService.findOneByUsername(registerUserDto.username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }
        const existingEmail = await this.usersService.findOneByEmail(registerUserDto.email);
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const newUser = await this.usersService.create(registerUserDto);

        // Manual strip password if needed, though DTO usually handles response formatting if using interceptors.
        // Here we just return simple object.
        const { password, ...result } = newUser;
        return result;
    }

    async validateUser(identity: string, pass: string): Promise<any> {
        let user = await this.usersService.findOneByUsername(identity);
        if (!user) {
            user = await this.usersService.findOneByEmail(identity);
        }

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto.identity, loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
