import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AccountService } from '../account/account.service';
import { OauthService } from './oauth.service';
import { Account } from '@repo/lib-prisma';

const GITHUB_PROVIDER = 'github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly accountService: AccountService,
    private readonly oauthService: OauthService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_REDIRECT_URI');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_REDIRECT_URI must be set',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, emails, photos, username, displayName } = profile;
    const email = this.#getEmail(emails, id, username || 'no-username');
    const avatarUrl = photos?.[0]?.value;

    let account: Account | null = null;

    const accountOAuth = await this.oauthService.findAccountOAuthById(
      GITHUB_PROVIDER,
      id,
    );
    if (!accountOAuth) {
      account = await this.accountService.findAccountByEmail(email);
      if (!account) {
        account = await this.accountService.createAccount(
          email,
          displayName,
          avatarUrl || '',
        );
      }

      await this.oauthService.createAccountOAuth(
        account.id,
        GITHUB_PROVIDER,
        id,
        accessToken,
      );
    } else {
      account = accountOAuth.account;
    }

    return account;
  }

  #getEmail(emails: Profile['emails'], id: string, username: string) {
    if (!emails || emails.length === 0) {
      return `${id}+${username}@users.no-reply.github.com`;
    }

    return emails[0].value;
  }
}
