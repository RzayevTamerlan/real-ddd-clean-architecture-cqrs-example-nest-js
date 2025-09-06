import { DomainError } from '@shared/domain/domain-error';
import { IsUUID, validateSync } from 'class-validator';

export class DeleteUserCommand {
  readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
    this.validate();
  }

  private validate(): void {
    const commandToValidate = new ValidatableDeleteUserCommand();
    Object.assign(commandToValidate, this);

    const errors = validateSync(commandToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );

      throw DomainError.validation(
        'UpdateUserByAdminCommand is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableDeleteUserCommand {
  @IsUUID('4', { message: 'User ID must be a valid UUIDv4.' })
  userId: string;
}
