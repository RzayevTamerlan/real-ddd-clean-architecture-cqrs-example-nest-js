import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/application/shared.module';
import { ChangePasswordCommandHandler } from '@user/application/commands/handlers/change-password.handler';
import { CreateUserCommandHandler } from '@user/application/commands/handlers/create-user.handler';
import { DeleteUserCommandHandler } from '@user/application/commands/handlers/delete-user.handler';
import { UpdateUserCommandHandler } from '@user/application/commands/handlers/update-user.handler';
import { UserCreatedEventHandler } from '@user/application/event-handlers/user-created.handler';
import { GetAllUsersHandler } from '@user/application/queries/handlers/get-all-users.handler';
import { GetUserByEmailHandler } from '@user/application/queries/handlers/get-user-by-email.handler';
import { GetUserByIdHandler } from '@user/application/queries/handlers/get-user-by-id.handler';
import { IUserRepository } from '@user/application/repositories/user.repository';
import { UserEntity } from '@user/infrastructure/persistence/mikro-orm/entities/user.entity';
import { UserMapper } from '@user/infrastructure/persistence/mikro-orm/mappers/user.mapper';
import { MikroOrmUserRepository } from '@user/infrastructure/persistence/mikro-orm/repositories/user.repository.impl';
import { UserController } from '@user/presentation/http/user.controller';

const CommandHandlers = [
  ChangePasswordCommandHandler,
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  UpdateUserCommandHandler,
];

const QueryHandlers = [
  GetAllUsersHandler,
  GetUserByEmailHandler,
  GetUserByIdHandler,
];

const EventHandlers = [UserCreatedEventHandler];

@Module({
  imports: [SharedModule, MikroOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: IUserRepository,
      useClass: MikroOrmUserRepository,
    },
    UserMapper,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  controllers: [UserController],
})
export class UserModule {}
