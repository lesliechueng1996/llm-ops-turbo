import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../common/util/password.util';
import { Account } from '@repo/lib-prisma';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './jwt-payload.type';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RefreshTokenReqDto } from '@repo/lib-api-schema';

const REFRESH_TOKEN_PREFIX = 'LLM-OPS-NEST:REFRESH_TOKEN:';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateAccount(email: string, password: string) {
    const account = await this.accountService.findAccountByEmail(email);
    if (!account) {
      this.logger.error(`Account not found: ${email}`);
      return null;
    }

    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      this.logger.error(`Invalid password for account: ${email}`);
      return null;
    }

    return account;
  }

  async generateToken(account: Account) {
    const currentTime = Math.floor(Date.now() / 1000);

    const payload: JwtPayload = {
      sub: account.id,
      iat: currentTime,
      iss: 'llm-ops-nest',
    };

    const refreshToken = uuidv4();
    await this.cacheManager.set(
      `${REFRESH_TOKEN_PREFIX}${account.id}`,
      refreshToken,
      1000 * 60 * 60 * 24 * 7,
    );

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async clearRefreshToken(accountId: string) {
    return this.cacheManager.del(`${REFRESH_TOKEN_PREFIX}${accountId}`);
  }

  async refreshToken(data: RefreshTokenReqDto) {
    const { refreshToken, accountId } = data;
    const cachedRefreshToken = await this.cacheManager.get(
      `${REFRESH_TOKEN_PREFIX}${accountId}`,
    );
    if (!cachedRefreshToken) {
      this.logger.error(`Refresh token not found: ${accountId}`);
      throw new UnauthorizedException('请重新登录');
    }

    if (cachedRefreshToken !== refreshToken) {
      this.logger.error(`Refresh token mismatch: ${accountId}`);
      await this.clearRefreshToken(accountId);
      throw new UnauthorizedException('请重新登录');
    }

    const account = await this.accountService.findAccountById(accountId);
    if (!account) {
      this.logger.error(`Account not found: ${accountId}`);
      throw new UnauthorizedException('请重新登录');
    }

    return this.generateToken(account);
  }
}
