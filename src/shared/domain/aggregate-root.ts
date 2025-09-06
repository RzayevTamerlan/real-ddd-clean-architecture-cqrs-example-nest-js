import { Auditable } from '@shared/domain/auditable.interface';
import { IDomainEvent } from '@shared/domain/domain-event.interface';
import { Entity } from '@shared/domain/entity';

export abstract class AggregateRoot<
  TProps extends Auditable,
  TId = string,
> extends Entity<TId> {
  private readonly _domainEvents: IDomainEvent[] = [];

  public readonly props: TProps;

  protected constructor(props: TProps, id: TId) {
    super(id);
    this.props = props;
  }

  public get domainEvents(): readonly IDomainEvent[] {
    return this._domainEvents;
  }

  public popDomainEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this.clearEvents();
    return events;
  }

  public clearEvents(): void {
    this._domainEvents.length = 0;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    if (!domainEvent) {
      throw new Error('Domain event cannot be null or undefined.');
    }
    this._domainEvents.push(domainEvent);
  }
}
