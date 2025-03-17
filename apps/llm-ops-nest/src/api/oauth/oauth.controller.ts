import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeGithubResDto } from '@repo/lib-api-schema';
import { Account } from '@repo/lib-prisma';
import { Request } from 'express';
import { ApiOperationWithErrorResponse } from '../../decorator/swagger.decorator';
import { AccountService } from '../account/account.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({
    summary: 'GitHub 授权',
    description: '重定向到 GitHub 授权页面',
  })
  @ApiFoundResponse({
    description: '重定向到 GitHub 授权页面',
  })
  github() {
    return;
  }

  @Get('authorize/github')
  @UseGuards(AuthGuard('github'))
  @ApiQuery({ name: 'code', type: String, description: 'GitHub 授权码' })
  @ApiOperationWithErrorResponse({
    summary: 'GitHub 登录',
    description: 'GitHub 登录',
    response: AuthorizeGithubResDto,
    auth: false,
  })
  async authorizeGithub(
    @Req() req: Request,
    @Headers('x-forwarded-for') forwarded: string | undefined,
  ) {
    const account = req.user as Account;
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;

    await this.accountService.updateAccountLoginInfo(
      account.id,
      ip || 'Unknown',
    );

    return this.authService.generateToken(account);
  }
}
