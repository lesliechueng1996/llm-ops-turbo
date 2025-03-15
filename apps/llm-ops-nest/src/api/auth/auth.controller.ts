import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CredentialReqDto, CredentialResDto } from '@repo/lib-api-schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Credential Login',
    description: 'Login with email and password',
  })
  @ApiBody({
    type: CredentialReqDto,
  })
  @ApiOkResponse({
    type: CredentialResDto,
  })
  @Post('credential')
  credentialLogin(@Body() body: CredentialReqDto) {
    console.log(body);
    return {
      accessToken: '123',
      refreshToken: '456',
    };
  }
}
