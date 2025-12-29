import { IsNotEmpty, IsString, IsNumber, IsUrl, IsOptional, Min, IsDateString } from 'class-validator';

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stockQuantity: number;

    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}
