import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_SIZE,
  GenerateCredentialReqDto,
  GenerateCredentialResDto,
} from '@repo/lib-api-schema';
import { ApiOperationWithErrorResponse } from '../../decorator/swagger.decorator';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { UploadFileService } from './upload-file.service';

@ApiTags('Upload File')
@Controller('upload-file')
export class UploadFileController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperationWithErrorResponse({
    summary: 'Get Upload File Temp Credential',
    description: 'Get Upload File Temp Credential',
    response: GenerateCredentialResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('credential')
  async getUploadFileTempCredential(
    @Query() query: GenerateCredentialReqDto,
  ): Promise<GenerateCredentialResDto> {
    const { fileName, fileSize } = query;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) {
      throw new BadRequestException('文件名格式错误');
    }

    if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      if (fileSize > ALLOWED_IMAGE_SIZE) {
        throw new BadRequestException('图片大小超过限制');
      }

      const fileKey = this.uploadFileService.generateFileKey(ext);
      const credential =
        await this.uploadFileService.getTempCredential(fileKey);

      return {
        credential,
        key: fileKey,
        bucket: {
          schema: this.configService.get('TENCENT_COS_SCHEMA', ''),
          name: this.configService.get('TENCENT_COS_BUCKET', ''),
          region: this.configService.get('TENCENT_COS_REGION', ''),
        },
      };
    }

    throw new BadRequestException('文件格式错误');
  }
}
