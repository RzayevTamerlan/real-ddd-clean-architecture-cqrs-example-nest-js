import { IDomainEvent } from '@shared/domain/domain-event.interface';
import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent implements IDomainEvent {
  readonly id: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly version: number;

  public get eventType(): string {
    return `${this.aggregateType}.${this.constructor.name}`;
  }

  abstract readonly aggregateType: string;

  protected constructor(aggregateId: string, version = 1) {
    this.id = uuidv4();
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.version = version;
  }
}
