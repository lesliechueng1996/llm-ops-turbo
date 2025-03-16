import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Account } from '@repo/lib-prisma';
import { Request } from 'express';
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
  github() {
    return;
  }

  @Get('authorize/github')
  @UseGuards(AuthGuard('github'))
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
