import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stockQuantity?: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}
