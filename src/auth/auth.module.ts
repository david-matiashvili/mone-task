import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    forwardRef(() => UserModule),
    DatabaseModule, ConfigModule,
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
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule]
})
export class AuthModule { }
