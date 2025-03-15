import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class OauthService {
  constructor(private readonly prisma: PrismaService) {}

  async findAccountOAuthById(provider: string, openid: string) {
    return this.prisma.accountOAuth.findUnique({
      include: {
        account: true,
      },
      where: {
        uk_account_oauth_provider_openid: {
          provider,
          openid,
        },
      },
    });
  }

  async createAccountOAuth(
    accountId: string,
    provider: string,
    openid: string,
    token: string,
  ) {
    return this.prisma.accountOAuth.create({
      data: {
        accountId,
        provider,
        openid,
        encryptedToken: token,
      },
    });
  }

  async updateEncryptedToken(id: string, token: string) {
    return this.prisma.accountOAuth.update({
      where: {
        id,
      },
      data: {
        encryptedToken: token,
      },
    });
  }
}
