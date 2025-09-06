import { ICommand } from '@nestjs/cqrs';
import { ICommandHandlerBase } from '@shared/application/command-handler.interface';
import { IUnitOfWork } from '@shared/application/ports/unit-of-work.interface';
import { Result } from '@shared/application/Result';
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { IDomainError } from '@shared/domain/domain-error';

import { IDomainEventDispatcher } from './ports/domain-event-dispatcher.interface';

export abstract class CommandHandlerBase<
  TCommand extends ICommand,
  TResponse,
  TAggregate extends AggregateRoot<any>,
> implements ICommandHandlerBase<TCommand, TResponse>
{
  protected constructor(
    private readonly eventDispatcher: IDomainEventDispatcher,
    protected readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(command: TCommand): Promise<Result<TResponse, IDomainError>> {
    const operationResult = await this.executeAsync(command);
    if (operationResult.isFailure) {
      return operationResult;
    }

    await this.unitOfWork.commitChanges();

    const aggregateRoot = this.getAggregateRoot(operationResult);
    if (aggregateRoot) {
      const domainEvents = aggregateRoot.popDomainEvents();
      await this.eventDispatcher.dispatchEvents(domainEvents);
    }

    return operationResult;
  }

  protected abstract executeAsync(
    command: TCommand,
  ): Promise<Result<TResponse, IDomainError>>;

  protected abstract getAggregateRoot(
    result: Result<TResponse, IDomainError>,
  ): TAggregate | undefined;
}
