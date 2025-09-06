import { DomainError } from '@shared/domain/domain-error';
import { IsEmail, validateSync } from 'class-validator';

export class GetUserByEmailQuery {
  readonly email: string;

  constructor(email: string) {
    this.email = email;

    this.validate();
  }

  private validate(): void {
    const queryToValidate = new ValidatableGetUserByEmailQuery();
    Object.assign(queryToValidate, this);
    const errors = validateSync(queryToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((e) =>
        Object.values(e.constraints || {}),
      );
      throw DomainError.validation(
        'GetUserByEmailQuery is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableGetUserByEmailQuery {
  @IsEmail({}, { message: 'A valid email is required.' })
  email: string;
}
