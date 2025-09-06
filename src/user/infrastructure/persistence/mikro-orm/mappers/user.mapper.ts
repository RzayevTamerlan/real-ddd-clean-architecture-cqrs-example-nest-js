import { Injectable } from '@nestjs/common';
import { capitalizeFirstLetter } from '@shared/utils/capitalizeFirstLetter';
import { normalizeString } from '@shared/utils/normalizeString';
import { User } from '@user/domain/user.model';
import { Email } from '@user/domain/value-objects/email.vo';
import { Password } from '@user/domain/value-objects/password.vo';
import { PersonName } from '@user/domain/value-objects/person-name.vo';
import { PhoneNumber } from '@user/domain/value-objects/phone-number.vo';
import { UserEntity } from '@user/infrastructure/persistence/mikro-orm/entities/user.entity';

@Injectable()
export class UserMapper {
  public toPersistence(user: User): Partial<UserEntity> {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.props.name.getValue(),
      surname: user.props.surname.getValue(),
      email: user.props.email.getValue(),
      phone: user.props.phone.getValue(),
      password: user.props.passwordHash
        ? user.props.passwordHash.getValue()
        : undefined,
      status: user.status,
      normalizedName: normalizeString(user.props.name.getValue()),
      normalizedSurname: capitalizeFirstLetter(user.props.surname.getValue()),
      normalizedEmail: capitalizeFirstLetter(user.props.email.getValue()),
    };
  }

  public toDomain(entity: UserEntity): User {
    const name = PersonName.create(entity.name, 'Name');
    const surname = PersonName.create(entity.surname, 'Surname');
    const email = Email.create(entity.email);
    const phone = PhoneNumber.create(entity.phone);
    const password = entity.password
      ? Password.fromHash(entity.password)
      : undefined;

    return User.reconstitute(entity.id, {
      ...entity,
      name,
      surname,
      email,
      phone,
      passwordHash: password,
    });
  }
}
