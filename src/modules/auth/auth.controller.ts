import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local-auth-guard';
import {
  ChangePasswordDto,
  LoginDTO,
  NewResetPasswordDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { extractTokenFromReq } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() _body: LoginDTO, @Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/verify-otp')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body);
  }

  @Post('/send-otp')
  sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body);
  }

  @Post('/initiate-reset-password')
  initiateResetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.initiateResetPassword(body);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() body: ChangePasswordDto, @Req() req: any) {
    return this.authService.changePassword(body, req.user);
  }

  @Post('/reset-password')
  resetPassword(@Body() body: NewResetPasswordDto, @Req() req: Request) {
    const token = extractTokenFromReq(
      req,
      'Kindly provide a valid access token to reset your password',
    );
    return this.authService.resetPassword(body, token);
  }
}
