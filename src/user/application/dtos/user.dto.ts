import { BaseGetDto } from '@shared/application/dtos/base-get.dto';
import { Status } from '@user/domain/enums/status';

export class UserDto extends BaseGetDto {
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: string;
  readonly status: Status;
  readonly passwordHash?: string;
}
