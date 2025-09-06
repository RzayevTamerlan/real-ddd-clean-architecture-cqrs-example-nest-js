import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '@user/application/dtos/user.dto';
import { UserDtoMapper } from '@user/application/mappers/user-dto.mapper';
import { GetUserByIdQuery } from '@user/application/queries/get-user-by-id.query';
import { IUserRepository } from '@user/application/repositories/user.repository';

type GetUserByIdResponse = UserDto | null;

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, GetUserByIdResponse>
{
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResponse> {
    const { userId } = query;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return null;
    }

    return UserDtoMapper.toDto(user);
  }
}
