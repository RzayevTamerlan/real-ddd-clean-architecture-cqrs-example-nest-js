import { DomainError } from '@shared/domain/domain-error';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min, validateSync } from 'class-validator';

export class PaginatedQuery {
  readonly page: number;
  readonly limit: number;

  protected constructor(page?: number, limit?: number) {
    this.page = page ?? 1;
    this.limit = limit ?? 12;

    this.validate();
  }

  protected validate(): void {
    const queryToValidate = new ValidatablePaginatedQuery();
    Object.assign(queryToValidate, this);
    const errors = validateSync(queryToValidate);
    if (errors.length > 0) {
      const errorMessages = errors.flatMap((e) =>
        Object.values(e.constraints || {}),
      );
      throw DomainError.validation(
        'PaginatedQuery is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatablePaginatedQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(1)
  page: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(1)
  @Max(100)
  limit: number;
}
