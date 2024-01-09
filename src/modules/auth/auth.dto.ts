import { IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { OTPActionType, UserType } from 'src/types';

export class LoginDTO {
  @IsString()
  emailOrPhone: string;

  @IsString()
  password: string;

  @IsString()
  type: UserType;
}

export class VerifyOtpDto {
  @IsString()
  pinId: string;

  @IsString()
  otp: string;

  @IsNumber()
  userId: number;

  @IsEnum(UserType)
  userType: UserType;

  @IsEnum(OTPActionType)
  otpActionType: OTPActionType;
}

export class SendOtpDto {
  @IsNumber()
  userId: number;

  @IsEnum(UserType)
  userType: UserType;

  @IsEnum(OTPActionType)
  otpActionType: OTPActionType;
}

export class ResetPasswordDto {
  @IsString()
  emailOrPhone: string;

  @IsEnum(UserType)
  userType: UserType;
}

export class ChangePasswordDto {
  @IsString()
  @Length(1, 50)
  newPassword: string;

  @IsString()
  @Length(1, 50)
  oldPassword: string;
}

export class NewResetPasswordDto {
  @IsString()
  password: string;
}
