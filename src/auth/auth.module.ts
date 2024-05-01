import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      timeout: configService.get('HTTP_TIMEOUT'),
      maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
    }),
    inject: [ConfigService],
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
