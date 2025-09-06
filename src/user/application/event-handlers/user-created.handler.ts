import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@user/domain/events';

@Injectable()
export class UserCreatedEventHandler {
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  @OnEvent(UserCreatedEvent.name)
  async handle(event: UserCreatedEvent) {
    this.logger.log(`User created with ID: ${event.aggregateId}`);
    this.logger.log(`Payload: ${JSON.stringify(event.payload, null, 2)}`);
  }
}
