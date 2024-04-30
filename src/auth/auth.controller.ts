import { Body, Controller, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDto, SessionDto } from './dto';

@Controller('v1/users')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(":id/session")
  session(@Param('id') userId: string, @Headers("Api-Token") token: string, @Body() body: SessionDto) {
    if (!body.expirationDate) {
      body.expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    }
    return this.authService.session(token, body.expirationDate, userId);
  }

  @Post(":id/auth")
  auth(@Param('id') userId: string, @Headers("Api-Token") token: string, @Body() body: AuthBodyDto) {
    return this.authService.auth(userId, token, body.token);
  }
}
