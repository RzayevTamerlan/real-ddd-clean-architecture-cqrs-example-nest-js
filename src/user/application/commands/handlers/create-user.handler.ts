import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from '@shared/application/command-handler.base';
import { IDomainEventDispatcher } from '@shared/application/ports/domain-event-dispatcher.interface';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';
import { Result } from '@shared/application/Result';
import { DomainError, IDomainError } from '@shared/domain/domain-error';
import { CreateUserCommand } from '@user/application/commands/create-user.command';
import { IUserRepository } from '@user/application/repositories/user.repository';
import { User } from '@user/domain/user.model';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends CommandHandlerBase<
  CreateUserCommand,
  string,
  User
> {
  private createdUser?: User;

  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IDomainEventDispatcher)
    eventDispatcher: IDomainEventDispatcher,
    @Inject(IUnitOfWork)
    unitOfWork: IUnitOfWork,
  ) {
    super(eventDispatcher, unitOfWork);
  }

  protected async executeAsync(
    command: CreateUserCommand,
  ): Promise<Result<string, IDomainError>> {
    const userExists = await this.userRepository.findByEmail(command.email);
    if (userExists) {
      return Result.failure(
        DomainError.conflict('User with this email already exists.'),
      );
    }

    const user = await User.create({
      name: command.name,
      surname: command.surname,
      email: command.email,
      phone: command.phone,
      password: command.password,
    });

    this.userRepository.save(user);

    this.createdUser = user;

    return Result.success(user.id);
  }

  protected getAggregateRoot(): User | undefined {
    return this.createdUser;
  }
}
