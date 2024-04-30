import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async session(apiToken: string, expirationDate: number, userId: string) {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    if (expirationDate < currentUnixTime) {
      throw new UnauthorizedException("expiration date is in the past");
    }
    if (apiToken == process.env.API_TOKEN) {
      const payload = {
        userId,
        expirationDate
      };
      const token = await this.jwtService.signAsync(payload);
      return { token: btoa(token) };
    } else {
      throw new UnauthorizedException("invalid token");
    }
  }

  async auth(userId: string, apiToken: string, token: string) {
    if (apiToken == process.env.API_TOKEN) {
      try {
        const payload: any = await this.jwtService.verifyAsync(atob(token));
        if (payload.expirationDate <= Math.floor(Date.now() / 1000)) {
          throw new UnauthorizedException("invalid token");
        }
        if (payload.userId !== userId) {
          throw new UnauthorizedException("invalid token");
        }
        delete payload.iat;
      } catch (error) {
        throw new UnauthorizedException("invalid token");
      }
    } else {
      throw new UnauthorizedException("invalid token");
    }
  }
}
