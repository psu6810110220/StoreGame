import { IsString, IsNumber, IsUrl, IsOptional, Min, IsDateString } from 'class-validator';

export class UpdateGameDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}
