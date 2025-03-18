import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { getCredential } from 'qcloud-cos-sts';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {}

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
}
