import { Injectable } from '@nestjs/common';
import { Account } from '@repo/lib-prisma';
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

  async findAccountById(id: string) {
    return this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }

  async updateAccountField(id: string, field: keyof Account, value: string) {
    return this.prisma.account.update({
      where: {
        id,
      },
      data: {
        [field]: value,
      },
    });
  }
}
