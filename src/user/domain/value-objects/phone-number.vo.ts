import { DomainError } from '@shared/domain/domain-error';

export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static create(value: string): PhoneNumber {
    if (value === null || value === undefined) {
      throw DomainError.badRequest('Phone number cannot be empty.');
    }

    const phoneRegex = /^\+994\d{9}$/;

    if (!phoneRegex.test(value)) {
      throw DomainError.badRequest(
        'Invalid phone number format. Expected: +994XXXXXXXXX.',
      );
    }

    return new PhoneNumber(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
