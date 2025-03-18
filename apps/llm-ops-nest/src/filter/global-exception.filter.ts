import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error('Exception: ', exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '系统异常';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (
        'message' in response &&
        typeof response.message === 'string'
      ) {
        message = response.message;
      } else if ('message' in response && Array.isArray(response.message)) {
        message = response.message.join(',');
      } else {
        message = JSON.stringify(response);
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
