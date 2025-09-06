import { UserDto } from '@user/application/dtos/user.dto';
import { User } from '@user/domain/user.model';

export class UserDtoMapper {
  public static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      status: user.status,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      passwordHash: user.passwordHash || undefined,
    };
  }

  public static toDtoList(users: User[]): UserDto[] {
    return users.map(this.toDto);
  }
}
