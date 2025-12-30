import { IsNotEmpty, IsString, IsNumber, IsUrl, IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stockQuantity: number;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}
