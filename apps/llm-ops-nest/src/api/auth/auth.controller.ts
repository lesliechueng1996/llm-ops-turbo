import { Body, Controller, Post } from '@nestjs/common';
import { CredentialReqDto } from '@repo/lib-api-schema';

@Controller('auth')
export class AuthController {
  @Post('credential')
  credentialLogin(@Body() body: CredentialReqDto) {
    console.log(body);
    return {
      accessToken: '123',
      refreshToken: '456',
    };
  }
}
