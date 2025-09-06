import { Entity, Enum, Index, OnInit, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '@shared/infrastructure/persistence/mikro-orm/base.entity';
import { Status } from '@user/domain/enums/status';

@Entity({ tableName: 'users' })
@Index({ properties: ['normalizedEmail'] })
@Index({ properties: ['email'] })
export class UserEntity extends BaseEntity {
  @Property({ type: 'varchar', length: 100 })
  name: string;

  @Property({ type: 'varchar', length: 100 })
  normalizedName: string;

  @Property({ type: 'varchar', length: 100 })
  surname: string;

  @Property({ type: 'varchar', length: 100 })
  normalizedSurname: string;

  @Property({ type: 'varchar', length: 255 })
  @Unique()
  email: string;

  @Property({ type: 'varchar', length: 255 })
  @Unique()
  normalizedEmail: string;

  @Property({ type: 'varchar', length: 20 })
  phone: string;

  @Property({ type: 'text', lazy: true })
  password: string;

  @Enum({ items: () => Status, default: Status.ACTIVE })
  status: Status;

  @OnInit()
  normalizeFields(): void {
    this.normalizedName = this.name.toUpperCase();
    this.normalizedSurname = this.surname.toUpperCase();
    this.normalizedEmail = this.email.toUpperCase();
  }
}
