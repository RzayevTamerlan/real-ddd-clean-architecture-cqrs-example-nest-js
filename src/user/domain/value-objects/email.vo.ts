import { DomainError } from '@shared/domain/domain-error';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static create(value: string): Email {
    if (value === null || value === undefined) {
      throw DomainError.badRequest('Email cannot be empty.');
    }

    const trimmedLowercased = value.trim().toLowerCase();
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!emailRegex.test(trimmedLowercased)) {
      throw DomainError.badRequest('Invalid email format.');
    }

    return new Email(trimmedLowercased);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
