
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // Check is user logined and put user info to request obj            
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('JWT_SECRET')
                }
            );

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}
