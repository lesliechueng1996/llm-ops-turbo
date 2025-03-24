import { Module } from '@nestjs/common';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';
import { FileValidationPipe } from '../../pipe/file-validation.pipe';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService, FileValidationPipe],
})
export class UploadFileModule {}
