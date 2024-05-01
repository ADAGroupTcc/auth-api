import { Expose } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class SessionDto {
  @IsNumber()
  @IsOptional()
  expirationDate?: number;
}

export class AuthDto {
  cpf: number;
  expirationDate: number;
}

export class AuthBodyDto {
  @IsString()
  token: string;
}