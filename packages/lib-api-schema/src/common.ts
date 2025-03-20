import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const wrapResponseSchema = <T>(data: z.ZodType<T>) => {
  return z.object({
    statusCode: z.number().describe('HTTP status code'),
    message: z.string().describe('Response message'),
    data,
  });
};

export const successEmptyResponseSchema = wrapResponseSchema(z.object({}));

export type BaseResponse<T> = z.infer<ReturnType<typeof wrapResponseSchema<T>>>;

export const errorResponseSchema = wrapResponseSchema(z.null());

export class ErrorResponseDto extends createZodDto(
  extendApi(errorResponseSchema),
) {}

export class SuccessEmptyResponseDto extends createZodDto(
  extendApi(successEmptyResponseSchema),
) {}

export const paginationReqSchema = z.object({
  currentPage: z
    .number()
    .min(1, { message: '页码不能小于1' })
    .max(9999, { message: '页码不能大于9999' })
    .optional()
    .default(1)
    .describe('当前页码'),
  pageSize: z
    .number()
    .min(1, { message: '每页条数不能小于1' })
    .max(50, { message: '每页条数不能大于50' })
    .optional()
    .default(10)
    .describe('每页条数'),
});

export type PaginationReq = z.infer<typeof paginationReqSchema>;

export const wrapSuccessPaginationDataSchema = <T>(data: z.ZodType<T>) => {
  return z.object({
    paginator: z.object({
      total: z.number().describe('总条数'),
      currentPage: z.number().describe('当前页码'),
      pageSize: z.number().describe('每页条数'),
      totalPage: z.number().describe('总页数'),
    }),
    list: z.array(data).describe('列表'),
  });
};
export const wrapSuccessPaginationResponseSchema = <T>(data: z.ZodType<T>) => {
  return z.object({
    statusCode: z.number().describe('HTTP status code'),
    message: z.string().describe('Response message'),
    data: wrapSuccessPaginationDataSchema(data),
  });
};

export type SuccessPaginationResponse<T> = z.infer<
  ReturnType<typeof wrapSuccessPaginationResponseSchema<T>>
>;
