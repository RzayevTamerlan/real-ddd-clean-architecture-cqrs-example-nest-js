import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '@user/application/dtos/user.dto';
import { UserDtoMapper } from '@user/application/mappers/user-dto.mapper';
import { GetUserByEmailQuery } from '@user/application/queries/get-user-by-email.query';
import { IUserRepository } from '@user/application/repositories/user.repository';

type GetUserByEmailResponse = UserDto | null;

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, GetUserByEmailResponse>
{
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<GetUserByEmailResponse> {
    const { email } = query;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    return UserDtoMapper.toDto(user);
  }
}
