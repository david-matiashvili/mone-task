import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register_user.dto';
import { SuccessResponse } from 'src/common/dto/response.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { Response } from "express"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(data);

    res.cookie('token', token, {
      httpOnly: true,
      signed: true,
      secure: true,
      maxAge: 10 * 60 * 60 * 1000 * 30,
    });

    return new SuccessResponse("Logined successfully!", { token });
  }
  
  @Post('register')
  @HttpCode(201)
  async register(@Body() data: RegisterUserDto): Promise<SuccessResponse<null>> {
    await this.authService.register(data);
    return new SuccessResponse("Registered successfully!");
  }
}
