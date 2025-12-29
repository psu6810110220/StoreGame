import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty({ message: 'กรุณากรอก Username หรือ Email ของคุณ' })
    @IsString()
    readonly identity: string;

    @IsNotEmpty({ message: 'กรุณากรอก Password' })
    @IsString()
    readonly password: string;
}