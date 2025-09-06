import { AggregateRoot } from '@shared/domain/aggregate-root';
import { Auditable } from '@shared/domain/auditable.interface';
import { DomainError } from '@shared/domain/domain-error';
import { Status } from '@user/domain/enums/status';
import {
  UserActivatedEvent,
  UserBlockedEvent,
  UserCreatedEvent,
  UserPasswordChangedEvent,
  UserUpdatedEvent,
} from '@user/domain/events';
import { Email } from '@user/domain/value-objects/email.vo';
import { Password } from '@user/domain/value-objects/password.vo';
import { PersonName } from '@user/domain/value-objects/person-name.vo';
import { PhoneNumber } from '@user/domain/value-objects/phone-number.vo';
import { v4 as uuidv4 } from 'uuid';

export interface UserProps extends Auditable {
  id: string;
  name: PersonName;
  surname: PersonName;
  email: Email;
  phone: PhoneNumber;
  status: Status;
  passwordHash?: Password;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id || uuidv4());
  }

  public static async create(createProps: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<User> {
    const nameVO = PersonName.create(createProps.name, 'Name');
    const surnameVO = PersonName.create(createProps.surname, 'Surname');
    const emailVO = Email.create(createProps.email);
    const phoneVO = PhoneNumber.create(createProps.phone);
    const passwordVO = createProps.password
      ? await Password.create(createProps.password)
      : undefined;

    const props: UserProps = {
      id: uuidv4(),
      status: Status.ACTIVE,
      name: nameVO,
      surname: surnameVO,
      email: emailVO,
      phone: phoneVO,
      passwordHash: passwordVO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = new User(props, props.id);

    user.addDomainEvent(
      new UserCreatedEvent(user.id, {
        email: user.props.email.getValue(),
        name: user.props.name.getValue(),
        surname: user.props.surname.getValue(),
      }),
    );

    return user;
  }

  public static reconstitute(id: string, props: UserProps): User {
    return new User(props, id);
  }

  public get name(): string {
    return this.props.name.getValue();
  }
  public get surname(): string {
    return this.props.surname.getValue();
  }
  public get email(): string {
    return this.props.email.getValue();
  }
  public get phone(): string {
    return this.props.phone.getValue();
  }
  public get passwordHash(): string | undefined {
    return this.props.passwordHash
      ? this.props.passwordHash.getValue()
      : undefined;
  }
  public get status(): Status {
    return this.props.status;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (this.props.status !== Status.ACTIVE) {
      throw DomainError.badRequest(
        'Cannot change password for a non-active user.',
      );
    }

    if (!this.props.passwordHash) {
      throw DomainError.badRequest(
        'Password change is not available for users without a password set.',
      );
    }

    if (oldPassword === newPassword) {
      throw DomainError.badRequest(
        'New password and old password cannot be the same.',
      );
    }

    const isOldPasswordValid =
      await this.props.passwordHash.compare(oldPassword);
    if (!isOldPasswordValid) {
      throw DomainError.badRequest(
        'The old password you entered is incorrect.',
      );
    }

    this.props.passwordHash = await Password.create(newPassword);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserPasswordChangedEvent(this.id, {
        email: this.props.email.getValue(),
        name: this.props.name.getValue(),
        surname: this.props.surname.getValue(),
      }),
    );
  }

  public ban(): void {
    if (this.props.status === Status.BANNED) {
      return;
    }
    this.props.status = Status.BANNED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserBlockedEvent(this.id, {
        email: this.props.email.getValue(),
        name: this.props.name.getValue(),
        surname: this.props.surname.getValue(),
      }),
    );
  }

  public activate(): void {
    if (this.props.status === Status.ACTIVE) {
      return;
    }
    const prevStatus = this.props.status;

    this.props.status = Status.ACTIVE;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserActivatedEvent(this.id, {
        email: this.props.email.getValue(),
        name: this.props.name.getValue(),
        surname: this.props.surname.getValue(),
        prevStatus,
      }),
    );
  }

  public updateProfile(data: {
    name: string;
    surname: string;
    phone: string;
  }): void {
    this.props.name = PersonName.create(data.name, 'Name');
    this.props.surname = PersonName.create(data.surname, 'Surname');
    this.props.phone = PhoneNumber.create(data.phone);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserUpdatedEvent(this.id, {
        email: this.props.email.getValue(),
        name: this.props.name.getValue(),
        surname: this.props.surname.getValue(),
      }),
    );
  }
}
