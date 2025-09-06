import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from '@shared/application/Paginated';
import { UserDto } from '@user/application/dtos/user.dto';
import { UserDtoMapper } from '@user/application/mappers/user-dto.mapper';
import { GetAllUsersQuery } from '@user/application/queries/get-all-users.query';
import { IUserRepository } from '@user/application/repositories/user.repository';

type GetAllUsersResponse = Paginated<UserDto>;

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler
  implements IQueryHandler<GetAllUsersQuery, GetAllUsersResponse>
{
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetAllUsersQuery): Promise<GetAllUsersResponse> {
    const paginatedUsers = await this.userRepository.findAllPaginated(query);

    const userDtos = UserDtoMapper.toDtoList(paginatedUsers.data);

    return new Paginated({
      ...paginatedUsers,
      data: userDtos,
    });
  }
}
