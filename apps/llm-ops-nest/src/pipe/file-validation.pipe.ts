import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const SUPPORTED_FILE_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
];

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // 检查文件是否存在
    if (!value) {
      throw new BadRequestException('文件不能为空');
    }

    // size 15MB
    if (value.size > 15 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过15MB');
    }

    // mimetype text/*
    if (value.mimetype.startsWith('text/')) {
      return value;
    }

    // extension
    const fileExtension = value.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !SUPPORTED_FILE_EXTENSIONS.includes(fileExtension)) {
      throw new BadRequestException('文件类型不支持');
    }

    return value;
  }
}
