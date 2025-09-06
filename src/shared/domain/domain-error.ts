import { ErrorType } from '@shared/domain/error-types.enum';

export interface IDomainError {
  errorType: ErrorType;
  errorMessage: string;
  errors?: string[];
}

export class DomainError extends Error implements IDomainError {
  public readonly errorType: ErrorType;
  public readonly errors?: string[];

  private constructor(type: ErrorType, message: string, errors?: string[]) {
    super(message);
    this.errorType = type;
    this.errors = errors;
  }

  public get errorMessage(): string {
    return this.message;
  }

  public static conflict(message: string): DomainError {
    return new DomainError(ErrorType.Conflict, message);
  }

  public static tooManyRequests(message: string): DomainError {
    return new DomainError(ErrorType.TooManyRequests, message);
  }

  public static notFound(message: string): DomainError {
    return new DomainError(ErrorType.NotFound, message);
  }

  public static badRequest(message: string): DomainError {
    return new DomainError(ErrorType.BadRequest, message);
  }

  public static validation(message: string, errors: string[]): DomainError {
    return new DomainError(ErrorType.Validation, message, errors);
  }

  public static unexpected(message: string): DomainError {
    return new DomainError(ErrorType.Unexpected, message);
  }

  public static unauthorized(message: string): DomainError {
    return new DomainError(ErrorType.Unauthorized, message);
  }
}
