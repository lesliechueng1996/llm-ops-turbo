import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_SIZE,
  GenerateCredentialReqDto,
  GenerateCredentialRes,
  GenerateCredentialResDto,
  SaveFileResDto,
} from '@repo/lib-api-schema';
import { ApiOperationWithErrorResponse } from '../../decorator/swagger.decorator';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { UploadFileService } from './upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../pipe/file-validation.pipe';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AlsContext } from '../../common/als/als.type';
import { FileUploadDto } from './upload-file.dto';

@ApiTags('Upload File')
@Controller('upload-file')
export class UploadFileController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
    private readonly als: AsyncLocalStorage<AlsContext>,
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
  ): Promise<GenerateCredentialRes> {
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

  @ApiOperationWithErrorResponse({
    summary: 'Save File',
    description: 'Save File',
    body: FileUploadDto,
    response: SaveFileResDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async saveFile(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    const accountId = this.als.getStore()?.accountId ?? '';
    const result = await this.uploadFileService.uploadFile(file);
    const uploadFile = await this.uploadFileService.saveFile({
      ...result,
      account: {
        connect: {
          id: accountId,
        },
      },
    });

    return {
      id: uploadFile.id,
      accountId: uploadFile.accountId,
      name: uploadFile.name,
      key: uploadFile.key,
      size: uploadFile.size,
      extension: uploadFile.extension,
      mimeType: uploadFile.mimeType,
      createdAt: uploadFile.createdAt,
    };
  }
}
