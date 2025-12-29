import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, Length } from 'class-validator';

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty({ message: 'กรุณากรอก Username' })
    @Length(4, 20, { message: 'Username ต้องมีความยาว 4-20 ตัวอักษร' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'กรุณากรอก Password' })
    @MinLength(4, { message: 'Password ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' })
    password: string;

    @IsEmail({}, { message: 'รูปแบบ Email ไม่ถูกต้อง' })
    @IsNotEmpty({ message: 'กรุณากรอก Email' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'กรุณากรอกเบอร์โทรศัพท์' })
    @Matches(/^\d{10}$/, { message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก' })
    phoneNumber: string;
}