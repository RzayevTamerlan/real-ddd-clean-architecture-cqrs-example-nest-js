import { Module } from '@nestjs/common';
import { IDomainEventDispatcher } from '@shared/application/ports/domain-event-dispatcher.interface';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';
import { NestJsEventDispatcher } from '@shared/infrastructure/events/nest-js-event-dispatcher';
import { MikroOrmUnitOfWork } from '@shared/infrastructure/persistence/mikro-orm/mikro-orm.unit-of-work';

const providers = [
  {
    provide: IUnitOfWork,
    useClass: MikroOrmUnitOfWork,
  },
  {
    provide: IDomainEventDispatcher,
    useClass: NestJsEventDispatcher,
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
