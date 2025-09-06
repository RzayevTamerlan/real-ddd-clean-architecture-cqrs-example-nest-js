import {
  BadRequestException,
  ConflictException,
  Controller,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Result } from '@shared/application/Result';
import { IDomainError } from '@shared/domain/domain-error';
import { ErrorType } from '@shared/domain/error-types.enum';

@Controller()
export abstract class BaseController {
  protected handleResult<T>(result: Result<T, IDomainError>): T {
    if (result.isFailure) {
      this.handleError(result.error);
    }
    return result.value;
  }

  private handleError(error: IDomainError): never {
    switch (error.errorType) {
      case ErrorType.Conflict:
        throw new ConflictException(error.errorMessage);
      case ErrorType.NotFound:
        throw new NotFoundException(error.errorMessage);
      case ErrorType.Validation:
        throw new BadRequestException({
          message: error.errorMessage,
          errors: error.errors,
        });
      case ErrorType.BadRequest:
        throw new BadRequestException(error.errorMessage);
      case ErrorType.Unexpected:
      default:
        throw new InternalServerErrorException(error.errorMessage);
    }
  }
}
