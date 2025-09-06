export interface IDomainEvent {
  readonly id: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly aggregateType: string;
  readonly eventType: string;
  readonly version: number;
}
