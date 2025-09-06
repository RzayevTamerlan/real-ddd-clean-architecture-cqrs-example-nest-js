import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getConfigModuleConfig } from '@shared/configs/getConfigModuleConfig';
import ormConfig from '@shared/infrastructure/persistence/mikro-orm/db/mikro-orm.config';
import { UserModule } from '@user/user.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(getConfigModuleConfig()),
    MikroOrmModule.forRoot(ormConfig),
    CqrsModule.forRoot(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
