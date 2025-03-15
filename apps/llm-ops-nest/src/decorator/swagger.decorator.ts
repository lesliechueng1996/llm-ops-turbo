import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiOperationOptions,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@repo/lib-api-schema';

export const ApiOperationWithErrorResponse = (options: ApiOperationOptions) => {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiOperation(options),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: ErrorResponseDto,
    }),
  );
};
