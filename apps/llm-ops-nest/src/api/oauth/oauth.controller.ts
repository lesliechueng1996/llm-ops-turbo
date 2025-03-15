import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Account } from '@repo/lib-prisma';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  github() {
    return;
  }

  @Get('authorize/github')
  @UseGuards(AuthGuard('github'))
  async authorizeGithub(@Req() req: Request) {
    const account = req.user as Account;
    return this.authService.generateToken(account);
  }
}
