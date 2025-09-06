import { DomainError } from '@shared/domain/domain-error';
import { IsUUID, Length, validateSync } from 'class-validator';

export class ChangePasswordCommand {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
  constructor(userId: string, currentPassword: string, newPassword: string) {
    this.userId = userId;
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.validate();
  }

  private validate(): void {
    const commandToValidate = new ValidatableChangePasswordCommand();
    Object.assign(commandToValidate, this);

    const errors = validateSync(commandToValidate);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );

      throw DomainError.validation(
        'ChangePasswordCommand is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableChangePasswordCommand {
  @IsUUID('4')
  userId: string;

  @Length(8, 50, {
    message: 'Current password must be between 8 and 50 characters long',
  })
  currentPassword: string;

  @Length(8, 50, {
    message: 'New password must be between 8 and 50 characters long',
  })
  newPassword: string;
}
