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
