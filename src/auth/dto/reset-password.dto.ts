import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  readonly token: string;



  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
