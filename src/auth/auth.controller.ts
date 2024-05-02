import { Body, Controller, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDto, SessionDto } from './dto';

@Controller('v1/users')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(":cpf/session")
  session(@Param('cpf') cpf: number, @Body() body: SessionDto) {
    if (!body.expirationDate) {
      body.expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    }
    return this.authService.session(body.expirationDate, cpf);
  }

  @Post(":cpf/auth")
  @HttpCode(200)
  auth(@Param('cpf') cpf: number, @Body() body: AuthBodyDto) {
    return this.authService.auth(cpf, body.token);
  }
}
