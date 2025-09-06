import { DomainError } from '@shared/domain/domain-error';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  validateSync,
} from 'class-validator';

export class UpdateUserCommand {
  readonly userId: string;
  readonly name: string;
  readonly surname: string;
  readonly phone: string;

  constructor(props: Omit<UpdateUserCommand, 'validate'>) {
    Object.assign(this, props);
    this.validate();
  }

  private validate(): void {
    const commandToValidate = new ValidatableUpdateUserCommand();
    Object.assign(commandToValidate, this);
    const errors = validateSync(commandToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((e) =>
        Object.values(e.constraints || {}),
      );
      throw DomainError.validation(
        'UpdateUserCommand is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableUpdateUserCommand {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters.' })
  name: string;

  @IsString({ message: 'Surname must be a string.' })
  @IsNotEmpty({ message: 'Surname cannot be empty.' })
  @MinLength(3, { message: 'Surname must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Surname cannot be longer than 50 characters.' })
  surname: string;

  @IsPhoneNumber('AZ', { message: 'A valid phone number is required.' })
  @IsNotEmpty({ message: 'Phone number cannot be empty.' })
  phone: string;
}
