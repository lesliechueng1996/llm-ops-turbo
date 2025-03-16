import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { GithubStrategy } from './github.strategy';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  imports: [AccountModule, AuthModule],
  controllers: [OauthController],
  providers: [OauthService, GithubStrategy],
})
export class OauthModule {}
