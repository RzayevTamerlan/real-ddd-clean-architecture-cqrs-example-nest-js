import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IDomainEventDispatcher } from '@shared/application/ports/domain-event-dispatcher.interface';
import { IDomainEvent } from '@shared/domain/domain-event.interface';

@Injectable()
export class NestJsEventDispatcher implements IDomainEventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async dispatchEvents(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      this.eventEmitter.emit(event.constructor.name, event);
    }
  }
}
