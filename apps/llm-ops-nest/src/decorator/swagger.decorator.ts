import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiOperationOptions,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@repo/lib-api-schema';

type DtoType = Type<unknown>;

export const ApiOperationWithErrorResponse = (
  options: ApiOperationOptions & {
    auth?: boolean;
    body?: DtoType;
    response?: DtoType;
  },
) => {
  const { body, response, auth = true, ...rest } = options;

  const typeDecorators: MethodDecorator[] = [];
  if (body) {
    typeDecorators.push(ApiBody({ type: body }));
  }
  if (response) {
    typeDecorators.push(ApiOkResponse({ type: response }));
  }
  if (auth) {
    typeDecorators.push(
      ApiHeader({ name: 'Authorization', description: 'Bearer token' }),
    );
    typeDecorators.push(ApiBearerAuth());
  }

  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiOperation(rest),
    ...typeDecorators,
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
