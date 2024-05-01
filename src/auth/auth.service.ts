import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from './dto/user.dto';
@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService, private readonly httpService: HttpService) { }

  async session(apiToken: string, expirationDate: number, cpf: number) {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    if (expirationDate < currentUnixTime) {
      throw new UnauthorizedException("expiration date is in the past");
    }
    if (apiToken == process.env.API_TOKEN) {
      const user = await this.findUser(cpf)
      if (user.length != 1) {
        throw new UnauthorizedException();
      }
      const payload = {
        cpf,
        expirationDate
      };
      const token = await this.jwtService.signAsync(payload);
      return { token: btoa(token) };
    } else {
      throw new UnauthorizedException();
    }
  }

  async auth(cpf: number, apiToken: string, token: string) {
    if (apiToken == process.env.API_TOKEN) {
      try {
        const user = await this.findUser(cpf)
        if (user.length != 1) {
          throw new UnauthorizedException();
        }
        const payload: any = await this.jwtService.verifyAsync(atob(token));
        if (payload.expirationDate <= Math.floor(Date.now() / 1000)) {
          throw new UnauthorizedException();
        }
        if (payload.cpf !== cpf) {
          throw new UnauthorizedException();
        }
        delete payload.iat;
      } catch (error) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async findUser(cpf: number): Promise<User[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ users: User[], next: number }>(`http://localhost:8001/v1/users?cpf=${cpf}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.warn('An error occurred while fetching user data:', error);
            throw new UnauthorizedException()
          }),
        ),
      );
      return data.users
    } catch (error) {
      throw error
    }
  }
}
