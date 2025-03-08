import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [DatabaseModule, UserModule, ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          secret: configService.get<string>('JWT_SECRET', 'default-secret'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
          },
        })
      },
    })],
  controllers: [AuthController],
  providers: [JwtModule, AuthService],
})
export class AuthModule { }
