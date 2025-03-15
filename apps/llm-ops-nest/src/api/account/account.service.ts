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
}
