import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@repo/lib-prisma';
import * as COS from 'cos-nodejs-sdk-v5';
import { format } from 'date-fns';
import { getCredential } from 'qcloud-cos-sts';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UploadFileService {
  private readonly cos: COS;
  private readonly logger = new Logger(UploadFileService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.cos = new COS({
      SecretId: this.configService.get('TENCENT_COS_SECRET_ID', ''),
      SecretKey: this.configService.get('TENCENT_COS_SECRET_KEY', ''),
      Protocol: this.configService.get('TENCENT_COS_SCHEMA', 'https'),
    });
  }

  generateFileKey(ext: string) {
    const date = format(new Date(), 'yyyyMMdd');
    return `${date}/${uuidv4()}.${ext}`;
  }

  async getTempCredential(fileKey: string) {
    const bucketName = this.configService.get('TENCENT_COS_BUCKET', '');
    const appId = bucketName.substring(1 + bucketName.lastIndexOf('-'));

    const credential = await getCredential({
      secretId: this.configService.get('TENCENT_COS_SECRET_ID', ''),
      secretKey: this.configService.get('TENCENT_COS_SECRET_KEY', ''),
      policy: {
        version: '2.0',
        statement: [
          {
            action: ['name/cos:PutObject'],
            effect: 'allow',
            principal: { qcs: ['*'] },
            resource: [
              `qcs::cos:${this.configService.get('TENCENT_COS_REGION', '')}:uid/${appId}:${bucketName}/${fileKey}`,
            ],
          },
        ],
      },
    });

    return {
      tmpSecretId: credential.credentials.tmpSecretId,
      tmpSecretKey: credential.credentials.tmpSecretKey,
      sessionToken: credential.credentials.sessionToken,
      startTime: credential.startTime,
      expiredTime: credential.expiredTime,
    };
  }

  async uploadFile(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop() ?? '';
    const fileKey = this.generateFileKey(ext);

    let tempFilePath = '';
    try {
      tempFilePath = path.join(os.tmpdir(), fileKey);

      // 确保目录存在
      const tempDir = path.dirname(tempFilePath);
      await fs.mkdir(tempDir, { recursive: true });

      this.logger.debug(`暂存文件到 ${tempFilePath}`);
      await fs.writeFile(tempFilePath, file.buffer);

      // 对中文文件名进行编码处理
      const encodedOriginalname = Buffer.from(
        file.originalname,
        'latin1',
      ).toString('utf8');

      const uploadPromise = new Promise<COS.UploadFileResult>(
        (resolve, reject) => {
          this.cos.uploadFile(
            {
              Bucket: this.configService.get('TENCENT_COS_BUCKET', ''),
              Region: this.configService.get('TENCENT_COS_REGION', ''),
              Key: fileKey,
              FilePath: tempFilePath,
            },
            (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            },
          );
        },
      );

      const result = await uploadPromise;
      this.logger.debug('上传文件成功');

      return {
        name: encodedOriginalname,
        key: fileKey,
        size: file.size,
        extension: ext,
        mimeType: file.mimetype,
        hash: result.ETag,
      };
    } catch (error) {
      this.logger.error(`上传文件失败: ${error.message}`);
      throw new InternalServerErrorException('上传文件失败');
    } finally {
      if (tempFilePath) {
        await fs.rm(tempFilePath);
        this.logger.debug(`删除临时文件 ${tempFilePath}`);
      }
    }
  }

  async saveFile(data: Prisma.UploadFileCreateInput) {
    return this.prisma.uploadFile.create({
      data,
    });
  }

  async getUploadFiles(ids: string[], accountId: string) {
    return this.prisma.uploadFile.findMany({
      where: {
        id: { in: ids },
        accountId,
      },
    });
  }
}
