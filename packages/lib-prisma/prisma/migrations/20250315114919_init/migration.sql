-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "account" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL DEFAULT '',
    "avatar" VARCHAR(255) NOT NULL DEFAULT '',
    "last_login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_ip" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "icon" VARCHAR(255) NOT NULL DEFAULT '',
    "status" "AppStatus" NOT NULL DEFAULT 'DRAFT',
    "app_config_id" VARCHAR(36),
    "draft_app_config_id" VARCHAR(36),
    "debug_conversation_id" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_oauth" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "provider" VARCHAR(255) NOT NULL DEFAULT '',
    "openid" VARCHAR(255) NOT NULL DEFAULT '',
    "encrypted_token" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_tool_provider" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "icon" VARCHAR(255) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "openapi_schema" JSONB NOT NULL,
    "headers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_tool_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_tool" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "provider_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "url" VARCHAR(255) NOT NULL DEFAULT '',
    "method" VARCHAR(32) NOT NULL DEFAULT '',
    "parameters" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_tool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE INDEX "idx_app_account_id" ON "app"("account_id");

-- CreateIndex
CREATE INDEX "idx_account_oauth_account_id_provider" ON "account_oauth"("account_id", "provider");

-- CreateIndex
CREATE INDEX "idx_api_tool_provider_account_id" ON "api_tool_provider"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_tool_provider_account_id_name_key" ON "api_tool_provider"("account_id", "name");

-- CreateIndex
CREATE INDEX "idx_api_tool_account_id" ON "api_tool"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_tool_provider_id_name_key" ON "api_tool"("provider_id", "name");

-- AddForeignKey
ALTER TABLE "app" ADD CONSTRAINT "app_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_oauth" ADD CONSTRAINT "account_oauth_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tool_provider" ADD CONSTRAINT "api_tool_provider_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tool" ADD CONSTRAINT "api_tool_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tool" ADD CONSTRAINT "api_tool_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "api_tool_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
