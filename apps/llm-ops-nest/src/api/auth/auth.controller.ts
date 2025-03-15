import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CredentialReqDto, CredentialResDto } from '@repo/lib-api-schema';
import { Request } from 'express';
import { ApiOperationWithErrorResponse } from 'src/decorator/swagger.decorator';
import { AuthService } from './auth.service';
import { Account } from '@repo/lib-prisma';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperationWithErrorResponse({
    summary: 'Credential Login',
    description: 'Login with email and password',
    auth: false,
    body: CredentialReqDto,
    response: CredentialResDto,
  })
  @Post('credential')
  @UseGuards(AuthGuard('local'))
  async credentialLogin(@Req() req: Request) {
    return this.authService.generateToken(req.user as Account);
  }

  @ApiOperationWithErrorResponse({
    summary: 'Logout',
    description: 'Logout',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    console.log(req.user);
  }
}
