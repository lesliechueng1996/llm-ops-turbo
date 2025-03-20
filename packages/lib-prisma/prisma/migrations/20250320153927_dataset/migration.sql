-- CreateTable
CREATE TABLE "dataset" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "icon" VARCHAR(255) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_file" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "key" VARCHAR(255) NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "extension" VARCHAR(255) NOT NULL DEFAULT '',
    "mime_type" VARCHAR(255) NOT NULL DEFAULT '',
    "hash" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upload_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_rule" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "dataset_id" VARCHAR(36) NOT NULL,
    "mode" VARCHAR(255) NOT NULL DEFAULT '',
    "rule" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "dataset_id" VARCHAR(36) NOT NULL,
    "upload_file_id" VARCHAR(36) NOT NULL,
    "process_rule_id" VARCHAR(36) NOT NULL,
    "batch" VARCHAR(255) NOT NULL DEFAULT '',
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 1,
    "character_count" INTEGER NOT NULL DEFAULT 0,
    "token_count" INTEGER NOT NULL DEFAULT 0,
    "processing_started_at" TIMESTAMP(3),
    "parsing_completed_at" TIMESTAMP(3),
    "splitting_completed_at" TIMESTAMP(3),
    "indexing_completed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "stopped_at" TIMESTAMP(3),
    "error" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_at" TIMESTAMP(3),
    "status" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment" (
    "id" VARCHAR(36) NOT NULL,
    "account_id" VARCHAR(36) NOT NULL,
    "dataset_id" VARCHAR(36) NOT NULL,
    "document_id" VARCHAR(36) NOT NULL,
    "node_id" VARCHAR(255),
    "position" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL DEFAULT '',
    "character_count" INTEGER NOT NULL DEFAULT 0,
    "token_count" INTEGER NOT NULL DEFAULT 0,
    "keywords" JSONB NOT NULL DEFAULT '[]',
    "hash" VARCHAR(255) NOT NULL DEFAULT '',
    "hit_count" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_at" TIMESTAMP(3),
    "processing_started_at" TIMESTAMP(3),
    "indexing_completed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "stopped_at" TIMESTAMP(3),
    "error" TEXT,
    "status" VARCHAR(255) NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_dataset_account_id" ON "dataset"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "dataset_account_id_name_key" ON "dataset"("account_id", "name");

-- CreateIndex
CREATE INDEX "idx_upload_file_account_id" ON "upload_file"("account_id");

-- CreateIndex
CREATE INDEX "idx_process_rule_account_id_dataset_id" ON "process_rule"("account_id", "dataset_id");

-- CreateIndex
CREATE INDEX "idx_document_account_id_dataset_id" ON "document"("account_id", "dataset_id");

-- CreateIndex
CREATE INDEX "idx_segment_account_id_dataset_id_document_id" ON "segment"("account_id", "dataset_id", "document_id");

-- AddForeignKey
ALTER TABLE "dataset" ADD CONSTRAINT "dataset_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_file" ADD CONSTRAINT "upload_file_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_rule" ADD CONSTRAINT "process_rule_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_rule" ADD CONSTRAINT "process_rule_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_upload_file_id_fkey" FOREIGN KEY ("upload_file_id") REFERENCES "upload_file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_process_rule_id_fkey" FOREIGN KEY ("process_rule_id") REFERENCES "process_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment" ADD CONSTRAINT "segment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment" ADD CONSTRAINT "segment_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment" ADD CONSTRAINT "segment_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
