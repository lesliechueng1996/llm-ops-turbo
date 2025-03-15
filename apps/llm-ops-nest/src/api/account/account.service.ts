import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAccountByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: {
        email,
      },
    });
  }

  async createAccount(email: string, name: string, avatar: string) {
    return this.prisma.account.create({
      data: {
        email,
        name,
        avatar,
      },
    });
  }

  async updateAccountLoginInfo(id: string, ip: string) {
    return this.prisma.account.update({
      where: {
        id,
      },
      data: {
        lastLoginIp: ip,
        lastLoginAt: new Date(),
      },
    });
  }
}
