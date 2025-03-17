import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.type';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AlsContext } from '../../common/als/als.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly als: AsyncLocalStorage<AlsContext>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const als = this.als.getStore();

    if (als) {
      als.accountId = payload.sub;
    } else {
      this.als.run({ accountId: payload.sub }, () => {
        // 这里不需要做任何事情，只是为了初始化 als context
      });
    }

    return { accountId: payload.sub };
  }
}
