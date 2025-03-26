import { Module } from '@nestjs/common';
import { FileValidationPipe } from '../../pipe/file-validation.pipe';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService, FileValidationPipe],
  exports: [UploadFileService],
})
export class UploadFileModule {}
