import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('v1/users')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(":id/session")
  session(@Param('id') userId: string, @Headers("Api-Token") token: string, @Body() body: AuthDto) {
    if (!body.expirationDate) {
      body.expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    }
    return this.authService.session(token, body.expirationDate, userId);
  }
}
