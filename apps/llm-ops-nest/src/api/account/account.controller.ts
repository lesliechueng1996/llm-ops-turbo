import { AsyncLocalStorage } from 'node:async_hooks';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAccountRes,
  GetAccountResDto,
  SuccessEmptyResponseDto,
  UpdateAvatarReqDto,
  UpdateNameReqDto,
  UpdatePasswordReqDto,
} from '@repo/lib-api-schema';
import { AlsContext } from 'src/common/als/als.type';
import { hashPassword } from 'src/common/util/password.util';
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

  @ApiOperationWithErrorResponse({
    summary: 'Update Password',
    description: 'Update Current Account Password',
    body: UpdatePasswordReqDto,
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(@Body() body: UpdatePasswordReqDto) {
    const accountId = this.als.getStore()?.accountId ?? '';

    const hashedPassword = await hashPassword(body.password);
    await this.accountService.updateAccountField(
      accountId,
      'password',
      hashedPassword,
    );
  }

  @ApiOperationWithErrorResponse({
    summary: 'Update Name',
    description: 'Update Current Account Name',
    body: UpdateNameReqDto,
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('name')
  async updateName(@Body() body: UpdateNameReqDto) {
    const accountId = this.als.getStore()?.accountId ?? '';
    await this.accountService.updateAccountField(accountId, 'name', body.name);
  }

  @ApiOperationWithErrorResponse({
    summary: 'Update Avatar',
    description: 'Update Current Account Avatar',
    body: UpdateAvatarReqDto,
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  async updateAvatar(@Body() body: UpdateAvatarReqDto) {
    const accountId = this.als.getStore()?.accountId ?? '';
    await this.accountService.updateAccountField(
      accountId,
      'avatar',
      body.avatar,
    );
  }
}
