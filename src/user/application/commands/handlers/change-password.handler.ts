import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from '@shared/application/command-handler.base';
import { IDomainEventDispatcher } from '@shared/application/ports/domain-event-dispatcher.interface';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';
import { Result } from '@shared/application/Result';
import { DomainError, IDomainError } from '@shared/domain/domain-error';
import { ChangePasswordCommand } from '@user/application/commands/change-password.command';
import { IUserRepository } from '@user/application/repositories/user.repository';
import { User } from '@user/domain/user.model';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler extends CommandHandlerBase<
  ChangePasswordCommand,
  void,
  User
> {
  private userToChangePassword?: User;

  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IDomainEventDispatcher)
    eventDispatcher: IDomainEventDispatcher,
    @Inject(IUnitOfWork)
    protected readonly unitOfWork: IUnitOfWork,
  ) {
    super(eventDispatcher, unitOfWork);
  }

  protected async executeAsync(
    command: ChangePasswordCommand,
  ): Promise<Result<void, IDomainError>> {
    const user = await this.userRepository.findByIdForAuthentication(
      command.userId,
    );
    if (!user) {
      return Result.failure(
        DomainError.notFound('User to change password not found.'),
      );
    }

    await user.changePassword(command.currentPassword, command.newPassword);

    this.userRepository.save(user);

    this.userToChangePassword = user;

    return Result.success(undefined);
  }

  protected getAggregateRoot(): User | undefined {
    return this.userToChangePassword;
  }
}
