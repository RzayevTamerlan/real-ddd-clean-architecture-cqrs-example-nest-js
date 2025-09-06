import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from '@shared/application/command-handler.base';
import { IDomainEventDispatcher } from '@shared/application/ports/domain-event-dispatcher.interface';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';
import { Result } from '@shared/application/Result';
import { DomainError, IDomainError } from '@shared/domain/domain-error';
import { DeleteUserCommand } from '@user/application/commands/delete-user.command';
import { IUserRepository } from '@user/application/repositories/user.repository';
import { User } from '@user/domain/user.model';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler extends CommandHandlerBase<
  DeleteUserCommand,
  void,
  User
> {
  private userToDelete?: User;

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
    command: DeleteUserCommand,
  ): Promise<Result<void, IDomainError>> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      return Result.failure(
        DomainError.notFound('User to delete was not found.'),
      );
    }
    // Can create a user.delete() method to handle domain logic before deletion.
    // For example, checking if the user can be deleted, logging, emitting event, etc.
    this.userRepository.delete(user);

    this.userToDelete = user;

    return Result.success();
  }

  protected getAggregateRoot(): User | undefined {
    return this.userToDelete;
  }
}
