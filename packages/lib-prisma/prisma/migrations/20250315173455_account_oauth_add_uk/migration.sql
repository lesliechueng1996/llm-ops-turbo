/*
  Warnings:

  - A unique constraint covering the columns `[provider,openid]` on the table `account_oauth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_oauth_provider_openid_key" ON "account_oauth"("provider", "openid");
