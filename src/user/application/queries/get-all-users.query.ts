import { PaginatedQuery } from '@shared/application/queries/paginated.query';
import { DomainError } from '@shared/domain/domain-error';
import { Status } from '@user/domain/enums/status';
import { IsEnum, IsOptional, IsString, validateSync } from 'class-validator';

interface GetAllUsersQueryProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
}

export class GetAllUsersQuery extends PaginatedQuery {
  readonly search?: string;
  readonly status?: Status;

  constructor(props: GetAllUsersQueryProps) {
    super(props.page, props.limit);

    this.search = props.search;
    this.status = props.status;

    this.validate();
  }

  protected validate(): void {
    super.validate();
    const queryToValidate = new ValidatableGetAllUsersQuery();
    Object.assign(queryToValidate, this);
    const errors = validateSync(queryToValidate);
    if (errors.length > 0) {
      const errorMessages = errors.flatMap((e) =>
        Object.values(e.constraints || {}),
      );
      throw DomainError.validation(
        'GetAllUsersQuery is not valid.',
        errorMessages,
      );
    }
  }
}

class ValidatableGetAllUsersQuery {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(Status) status?: Status;
}
