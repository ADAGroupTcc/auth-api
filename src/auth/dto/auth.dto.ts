import { Expose } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export class AuthDto {
  @IsNumber()
  @IsOptional()
  expirationDate?: number;
}