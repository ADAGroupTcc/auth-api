import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/user.dto';
@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) { }

  async session(expirationDate: number, userId: string) {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    if (expirationDate < currentUnixTime) {
      throw new UnauthorizedException("expiration date is in the past");
    }
    const user = await this.findUser(userId)
    if (user.length != 1) {
      throw new UnauthorizedException();
    }
    const payload = {
      userId,
      expirationDate
    };
    const token = await this.jwtService.signAsync(payload);
    return { token: btoa(token) };
  }

  async auth(userId: string, token: string) {
    const user = await this.findUser(userId)
    if (user.length != 1) {
      throw new UnauthorizedException();
    }
    const payload: any = await this.jwtService.verifyAsync(atob(token));
    if (payload.expirationDate <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException();
    }
    if (payload.userId !== userId) {
      throw new UnauthorizedException();
    }
    delete payload.iat;
  }

  async findUser(userId: string): Promise<User[]> {
    try {
      const response = await fetch(`${process.env.USER_API_BASE_URL}/v1/users/${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { users: User[], next: number } = await response.json()
      return data.users
    } catch (error) {
      this.logger.error(error)
      throw new UnauthorizedException();
    }
  }
}
