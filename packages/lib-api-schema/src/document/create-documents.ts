import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export enum ProcessType {
  Automatic = 'automatic',
  Custom = 'custom',
}

export enum PreProcessRuleId {
  RemoveExtraSpace = 'remove_extra_space',
  RemoveUrlAndEmail = 'remove_url_and_email',
}

export enum DocumentStatus {
  Waiting = 'waiting',
  Parsing = 'parsing',
  Splitting = 'splitting',
  Indexing = 'indexing',
  Completed = 'completed',
  Error = 'error',
}

export const CreateDocumentsReqSchema = z
  .object({
    uploadFileIds: z
      .array(z.string().nonempty({ message: '文件ID不能为空' }))
      .min(1, { message: '请至少选择一个文件' })
      .max(10, { message: '最多只能选择10个文件' })
      .describe('文件ID列表'),
    processType: z
      .nativeEnum(ProcessType, {
        message: 'processType 必须是 automatic 或 custom',
      })
      .describe('处理方式'),
    rule: z
      .object({
        preProcessRules: z
          .array(
            z.object({
              id: z
                .nativeEnum(PreProcessRuleId, {
                  message:
                    'id 必须是 remove_extra_space 或 remove_url_and_email',
                })
                .describe('规则ID'),
              enabled: z.boolean().describe('是否启用'),
            }),
          )
          .describe('预处理规则'),
        segment: z.object({
          separator: z
            .array(z.string())
            .nonempty({ message: '分隔符不能为空' })
            .describe('分隔符'),
          chunkSize: z
            .number()
            .int({ message: '分段大小必须是整数' })
            .min(100, { message: '分段大小不能小于100' })
            .max(1000, { message: '分段大小不能大于1000' })
            .describe('分段大小'),
          chunkOverlap: z
            .number()
            .int({ message: '分段重叠必须是整数' })
            .min(0, { message: '分段重叠不能小于0' })
            .max(100, { message: '分段重叠不能大于100' })
            .describe('分段重叠'),
        }),
      })
      .describe('自定义处理规则')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.processType === ProcessType.Custom && !data.rule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '当处理方式为custom时, 必须提供自定义处理规则',
        path: ['rule'],
      });
    }
  });

export type CreateDocumentsReq = z.infer<typeof CreateDocumentsReqSchema>;

export class CreateDocumentsReqDto extends createZodDto(
  extendApi(CreateDocumentsReqSchema),
) {}

export const CreateDocumentsResSchema = z.object({
  batch: z.string().describe('批次ID'),
  documents: z
    .array(
      z.object({
        id: z.string().describe('文档ID'),
        name: z.string().describe('文档名称'),
        status: z.nativeEnum(DocumentStatus).describe('文档状态'),
        createdAt: z.number().describe('创建时间'),
      }),
    )
    .describe('文档列表'),
});

export type CreateDocumentsRes = z.infer<typeof CreateDocumentsResSchema>;

export class CreateDocumentsResDto extends createZodDto(
  extendApi(CreateDocumentsResSchema),
) {}
