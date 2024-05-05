import { Body, Controller, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDto, SessionDto } from './dto';

@Controller('v1/users/:user_id')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("session")
  session(@Param('user_id') userId: string, @Body() body: SessionDto) {
    if (!body.expirationDate) {
      body.expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    }
    return this.authService.session(body.expirationDate, userId);
  }

  @Post("auth")
  @HttpCode(200)
  auth(@Param('user_id') userId: string, @Body() body: AuthBodyDto) {
    return this.authService.auth(userId, body.token);
  }
}
