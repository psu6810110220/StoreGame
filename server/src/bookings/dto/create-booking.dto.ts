import { IsArray, IsDateString, IsInt, IsNotEmpty, ValidateNested, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class BookingItemDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    gameId: number;

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}

export class CreateBookingDto {
    @IsNotEmpty()
    @IsDateString()
    pickupDate: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BookingItemDto)
    items: BookingItemDto[];

    @IsOptional()
    @IsString()
    slipUrl?: string;
}
