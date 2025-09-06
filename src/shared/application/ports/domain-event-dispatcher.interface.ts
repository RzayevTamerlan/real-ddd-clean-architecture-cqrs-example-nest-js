import { IDomainEvent } from '@shared/domain/domain-event.interface';

export const IDomainEventDispatcher = Symbol('IDomainEventDispatcher');

export interface IDomainEventDispatcher {
  dispatchEvents(events: IDomainEvent[]): Promise<void>;
}
