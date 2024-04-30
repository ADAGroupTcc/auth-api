import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
}
