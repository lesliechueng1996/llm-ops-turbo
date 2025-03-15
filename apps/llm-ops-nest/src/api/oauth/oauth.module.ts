import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { GithubStrategy } from './github.strategy';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AccountModule, AuthModule],
  controllers: [OauthController],
  providers: [OauthService, GithubStrategy],
})
export class OauthModule {}
