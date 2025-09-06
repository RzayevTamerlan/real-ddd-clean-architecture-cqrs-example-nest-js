import { DomainError } from '@shared/domain/domain-error';
import { hashPassword } from '@shared/utils/hashPassword';
import { compare } from 'bcryptjs';

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static fromHash(hash: string): Password {
    if (!hash) {
      throw DomainError.badRequest('Password hash cannot be empty.');
    }
    return new Password(hash);
  }

  public static async create(rawPassword: string): Promise<Password> {
    if (!rawPassword) {
      throw DomainError.badRequest('Password cannot be empty.');
    }
    if (rawPassword.length < 8 || rawPassword.length > 50) {
      throw DomainError.badRequest(
        'Password must be between 8 and 50 characters.',
      );
    }

    const hash = await hashPassword(rawPassword);

    return new Password(hash);
  }

  public compare(rawPassword: string): Promise<boolean> {
    return compare(rawPassword, this.value);
  }

  public getValue(): string {
    return this.value;
  }
}
