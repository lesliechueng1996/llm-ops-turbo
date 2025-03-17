import { AsyncLocalStorage } from 'node:async_hooks';
import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAccountRes, GetAccountResDto } from '@repo/lib-api-schema';
import { AlsContext } from 'src/common/als/als.type';
import { ApiOperationWithErrorResponse } from 'src/decorator/swagger.decorator';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AccountService } from './account.service';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly als: AsyncLocalStorage<AlsContext>,
  ) {}

  @ApiOperationWithErrorResponse({
    summary: 'Get Account',
    description: 'Get Current Account',
    response: GetAccountResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccount(): Promise<GetAccountRes> {
    const accountId = this.als.getStore()?.accountId ?? '';
    const account = await this.accountService.findAccountById(accountId);
    if (!account) {
      throw new NotFoundException('账户不存在');
    }
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      lastLoginIp: account.lastLoginIp,
      lastLoginAt: account.lastLoginAt.getTime(),
      createdAt: account.createdAt.getTime(),
    };
  }
}
