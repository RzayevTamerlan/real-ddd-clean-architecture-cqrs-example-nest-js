import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DomainError } from '@shared/domain/domain-error';
import { ErrorType } from '@shared/domain/error-types.enum';
import { Request, Response } from 'express';

interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors: string[];
}

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger = new Logger(GlobalExceptionsFilter.name),
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let errors: string[];

    if (exception instanceof DomainError) {
      this.logger.error(
        `[Domain Error]: ${exception.errorMessage}`,
        exception.errors?.join(', '),
      );

      message = exception.errorMessage;
      errors = exception.errors || [exception.errorMessage];

      switch (exception.errorType) {
        case ErrorType.Conflict:
          statusCode = HttpStatus.CONFLICT;
          break;
        case ErrorType.NotFound:
          statusCode = HttpStatus.NOT_FOUND;
          break;
        case ErrorType.Forbidden:
          statusCode = HttpStatus.FORBIDDEN;
          break;
        case ErrorType.Unauthorized:
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        case ErrorType.TooManyRequests:
          statusCode = HttpStatus.TOO_MANY_REQUESTS;
          break;
        case ErrorType.Validation:
          statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422
          break;
        case ErrorType.Unexpected:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        default:
          statusCode = HttpStatus.BAD_REQUEST;
          break;
      }
    } else if (exception instanceof HttpException) {
      this.logger.error(`[Http Error]: ${exception.message}`, exception.stack);

      statusCode = exception.getStatus();
      const responsePayload = exception.getResponse();

      if (typeof responsePayload === 'string') {
        message = responsePayload;
        errors = [responsePayload];
      } else {
        const nestError = responsePayload as {
          message: string | string[];
          error?: string;
        };
        message = nestError.error || 'An error occurred';
        errors = Array.isArray(nestError.message)
          ? nestError.message
          : [nestError.message];
      }
    } else {
      this.logger.error(
        '[Unexpected System Error]:',
        (exception as Error).stack,
      );

      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      errors = ['An unexpected error occurred. Please try again later.'];
    }

    const errorResponse: IErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    };

    response.status(statusCode).json(errorResponse);
  }
}
