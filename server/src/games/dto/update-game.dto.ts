import { IsString, IsNumber, IsUrl, IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGameDto {
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
    @IsDateString()
    releaseDate?: string;
}
