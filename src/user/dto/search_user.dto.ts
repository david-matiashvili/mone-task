import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsPositive, IsNumber } from 'class-validator';

export class SearchUsersDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsPositive()
  age?: number;
}
