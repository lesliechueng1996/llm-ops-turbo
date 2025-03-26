import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DatasetModule } from '../dataset/dataset.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { ProducerModule } from '../../producer/producer.module';

@Module({
  imports: [DatasetModule, UploadFileModule, ProducerModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
