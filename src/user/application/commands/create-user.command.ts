import { DomainError } from '@shared/domain/domain-error';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  validateSync,
} from 'class-validator';

interface CreateUserCommandProps {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
}

export class CreateUserCommand {
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;

  constructor(props: CreateUserCommandProps) {
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.password = props.password;
    this.phone = props.phone;

    this.validate();
  }

  private validate(): void {
    const commandToValidate = new ValidatableCreateUserCommand();
    Object.assign(commandToValidate, this);

    const errors = validateSync(commandToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );

      throw DomainError.validation(
        'CreateUserCommand is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableCreateUserCommand {
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

  @IsEmail({}, { message: 'A valid email is required.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(50, { message: 'Password cannot be longer than 50 characters.' })
  password: string;

  @IsPhoneNumber('AZ', { message: 'A valid phone number is required.' })
  @IsNotEmpty({ message: 'Phone number cannot be empty.' })
  phone: string;
}
