import {
  Controller,
  Post,
  Req,
  UseGuards,
  Headers,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  CredentialReqDto,
  CredentialResDto,
  RefreshTokenReqDto,
  RefreshTokenResDto,
} from '@repo/lib-api-schema';
import { Request } from 'express';
import { ApiOperationWithErrorResponse } from 'src/decorator/swagger.decorator';
import { AuthService } from './auth.service';
import { Account } from '@repo/lib-prisma';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { AccountService } from '../account/account.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @ApiOperationWithErrorResponse({
    summary: 'Credential Login',
    description: 'Login with email and password',
    auth: false,
    body: CredentialReqDto,
    response: CredentialResDto,
  })
  @Post('credential')
  @UseGuards(AuthGuard('local'))
  async credentialLogin(
    @Req() req: Request,
    @Headers('x-forwarded-for') forwarded: string,
  ) {
    const account = req.user as Account;
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;

    await this.accountService.updateAccountLoginInfo(
      account.id,
      ip || 'Unknown',
    );

    return this.authService.generateToken(req.user as Account);
  }

  @ApiOperationWithErrorResponse({
    summary: 'Logout',
    description: 'Logout',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const account = req.user as {
      accountId: string;
    };

    await this.authService.clearRefreshToken(account.accountId);

    return null;
  }

  @ApiOperationWithErrorResponse({
    summary: 'Refresh Token',
    description: 'Refresh Token',
    auth: false,
    body: RefreshTokenReqDto,
    response: RefreshTokenResDto,
  })
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.authService.refreshToken(body);
  }
}
