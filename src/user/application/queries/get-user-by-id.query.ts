import { DomainError } from '@shared/domain/domain-error';
import { IsUUID, validateSync } from 'class-validator';

export class GetUserByIdQuery {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.validate();
  }

  private validate(): void {
    const queryToValidate = new ValidatableGetUserByIdQuery();
    Object.assign(queryToValidate, this);
    const errors = validateSync(queryToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((e) =>
        Object.values(e.constraints || {}),
      );
      throw DomainError.validation(
        'GetUserByIdQuery is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableGetUserByIdQuery {
  @IsUUID('4', { message: 'User ID must be a valid UUID.' })
  userId: string;
}
