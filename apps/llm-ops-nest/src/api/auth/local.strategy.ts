import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  override async validate(email: string, password: string) {
    const account = await this.authService.validateAccount(email, password);
    if (!account) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return account;
  }
}
