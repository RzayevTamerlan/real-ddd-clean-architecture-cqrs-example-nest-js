import { EntityRepository, FilterQuery, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Paginated } from '@shared/application/Paginated';
import { normalizeString } from '@shared/utils/normalizeString';
import {
  FindUsersPaginatedOptions,
  IUserRepository,
} from '@user/application/repositories/user.repository';
import { User } from '@user/domain/user.model';
import { UserEntity } from '@user/infrastructure/persistence/mikro-orm/entities/user.entity';
import { UserMapper } from '@user/infrastructure/persistence/mikro-orm/mappers/user.mapper';

@Injectable()
export class MikroOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepo: EntityRepository<UserEntity>,
    private readonly mapper: UserMapper,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ email });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmailForAuthentication(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne(
      {
        email,
      },
      {
        fields: ['*'],
      },
    );
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByIdForAuthentication(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne(
      {
        id,
      },
      {
        fields: ['*'],
      },
    );

    return entity ? this.mapper.toDomain(entity) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.ormRepo.count({ email });
    return count > 0;
  }

  save(user: User): void {
    const entity = this.mapper.toPersistence(user);
    const existingEntity = this.ormRepo
      .getEntityManager()
      .getUnitOfWork()
      .getById(UserEntity.name, user.id);
    if (existingEntity) {
      wrap(existingEntity).assign(entity);
    } else {
      const newEntity = this.ormRepo.create(entity as UserEntity);
      this.ormRepo.getEntityManager().persist(newEntity);
    }
  }

  async findAllPaginated(
    options: FindUsersPaginatedOptions,
  ): Promise<Paginated<User>> {
    const { page, limit, search, status } = options;

    const where: FilterQuery<UserEntity> = {};

    if (search) {
      const normalizedSearch = `%${normalizeString(search)}%`;
      where.$or = [
        { normalizedName: { $ilike: normalizedSearch } },
        { normalizedSurname: { $ilike: normalizedSearch } },
        { normalizedEmail: { $ilike: normalizedSearch } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [entities, total] = await this.ormRepo.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    const users = entities.map((entity) => this.mapper.toDomain(entity));

    return new Paginated({
      data: users,
      totalItems: total,
      currentPage: page,
      currentLimit: limit,
    });
  }

  delete(user: User): void {
    this.ormRepo.getEntityManager().remove(user);
  }
}
