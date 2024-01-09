import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/modules/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'emailOrPhone', passReqToCallback: true });
  }

  async validate(req: Request, emailOrPhone: string, password: string) {
    const user = await this.authService.validateUser(
      emailOrPhone,
      password,
      req.body.type,
    );
    return user;
  }
}
