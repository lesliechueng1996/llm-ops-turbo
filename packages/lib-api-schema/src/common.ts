import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const wrapResponseSchema = <T>(data: z.ZodType<T>) => {
  return z.object({
    code: z.number().describe('HTTP status code'),
    message: z.string().describe('Response message'),
    data,
  });
};

export const successEmptyResponseSchema = wrapResponseSchema(z.object({}));

export type BaseResponse<T> = z.infer<ReturnType<typeof wrapResponseSchema<T>>>;

export const errorResponseSchema = wrapResponseSchema(z.null());

export class ErrorResponseDto extends createZodDto(errorResponseSchema) {}
