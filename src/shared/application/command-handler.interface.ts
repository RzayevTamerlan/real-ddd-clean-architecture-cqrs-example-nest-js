import { ICommand } from '@nestjs/cqrs';
import { Result } from '@shared/application/Result';
import { IDomainError } from '@shared/domain/domain-error';

export interface ICommandHandlerBase<TCommand extends ICommand, TResponse> {
  execute(command: TCommand): Promise<Result<TResponse, IDomainError>>;
}
