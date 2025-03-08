import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';

import { RegisterUserDto } from './dto/register_user.dto';
import { LoginUserDto } from './dto/login_user.dto';

import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly userService: UserService, private readonly jwtService: JwtService) { }

    // Hash password useing bcrypt
    private async hashPassword(password: string): Promise<string> {
        const salt = await genSalt();
        const hashedPass = await hash(password, salt);

        return hashedPass;
    }

    async register(data: RegisterUserDto): Promise<void> {
        const { email, first_name, last_name, age, password } = data;
        const hashedPass = await this.hashPassword(password);

        const sameEmailUser = await this.userService.findByEmail(email);

        if (sameEmailUser) throw new BadRequestException("User with this email exists!");

        const query = `
            INSERT INTO users (email, password, first_name, last_name, age)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        await this.databaseService.query(query, [email, hashedPass, first_name, last_name, age]);

    }

    async login(data: LoginUserDto) {
        const { email, password } = data;

        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException("User not found! Email or password is incorrect.");

        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new NotFoundException("User not found! Email or password is incorrect.")

        const payload = { id: user.id, email: user.email };

        const token = await this.jwtService.signAsync(payload);

        return { user, token };
    }

}
