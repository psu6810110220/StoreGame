import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsDateString, IsArray } from 'class-validator';
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
    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}
