import { IsEmail, IsString, MinLength, MaxLength, Min, IsNotEmpty } from "class-validator";

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;

    @Min(0)
    age: number;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;
}