import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private config: ConfigService,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = {
      statusCode: httpStatus,
      message: getErrorMessage(exception),
    };

    if (this.config.get('NODE_ENV') === 'development') {
      console.error(exception.stack);
      console.log(exception);
    }

    httpAdapter.reply(response, body, httpStatus);
  }
}

export interface BadRequestValidationExceptionResponse {
  statusCode: number;
  message: any;
  error: string;
}

export const getErrorMessage = <T>(exception: T): any => {
  let errorMessage: string;

  if (exception instanceof HttpException) {
    const errorResponse = exception.getResponse();

    errorMessage =
      (errorResponse as BadRequestValidationExceptionResponse).message ||
      exception.message;
  } else {
    errorMessage = String(exception);
  }

  return errorMessage;
};
