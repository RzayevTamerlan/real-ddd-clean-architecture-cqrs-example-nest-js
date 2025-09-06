import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';

@Injectable()
export class MikroOrmUnitOfWork implements IUnitOfWork {
  constructor(private readonly em: EntityManager) {}

  async commitChanges(): Promise<void> {
    await this.em.flush();
  }
}
