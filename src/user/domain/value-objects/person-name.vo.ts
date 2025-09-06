import { DomainError } from '@shared/domain/domain-error';

export class PersonName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static create(
    value: string,
    fieldName: 'Name' | 'Surname',
  ): PersonName {
    if (value === null || value === undefined) {
      throw DomainError.badRequest(`${fieldName} cannot be empty.`);
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < 3 || trimmedValue.length > 50) {
      throw DomainError.badRequest(
        `${fieldName} must be between 3 and 50 characters.`,
      );
    }

    return new PersonName(trimmedValue);
  }

  public getValue(): string {
    return this.value;
  }
}
