import { Paginated } from '@shared/application/Paginated';
import { Status } from '@user/domain/enums/status';
import { User } from '@user/domain/user.model';

export const IUserRepository = Symbol('IUserRepository');

export interface FindUsersPaginatedOptions {
  page: number;
  limit: number;
  search?: string;
  status?: Status;
  relations?: string[];
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailForAuthentication(email: string): Promise<User | null>;
  findByIdForAuthentication(id: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): void;
  findAllPaginated(
    options: FindUsersPaginatedOptions,
  ): Promise<Paginated<User>>;
  delete(user: User): void;
}
