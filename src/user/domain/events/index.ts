import { DomainEvent } from '@shared/domain/domain-event';
import { Status } from '@user/domain/enums/status';

const USER_AGGREGATE_TYPE = 'User';

interface UserCreateEventPayload {
  email: string;
  name: string;
  surname: string;
}

export class UserCreatedEvent extends DomainEvent {
  readonly aggregateType = USER_AGGREGATE_TYPE;
  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserCreateEventPayload,
  ) {
    super(aggregateId);
  }
}

interface UserUpdateEventPayload {
  email: string;
  name: string;
  surname: string;
}

export class UserUpdatedEvent extends DomainEvent {
  readonly aggregateType = USER_AGGREGATE_TYPE;
  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserUpdateEventPayload,
  ) {
    super(aggregateId);
  }
}

interface UserPasswordChangedEventPayload {
  email: string;
  name: string;
  surname: string;
}

export class UserPasswordChangedEvent extends DomainEvent {
  readonly aggregateType = USER_AGGREGATE_TYPE;
  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserPasswordChangedEventPayload,
  ) {
    super(aggregateId);
  }
}

interface UserBlockedEventPayload {
  email: string;
  name: string;
  surname: string;
}

export class UserBlockedEvent extends DomainEvent {
  readonly aggregateType = USER_AGGREGATE_TYPE;
  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserBlockedEventPayload,
  ) {
    super(aggregateId);
  }
}

interface UserActivatedEventPayload {
  email: string;
  name: string;
  surname: string;
  prevStatus: Status;
}

export class UserActivatedEvent extends DomainEvent {
  readonly aggregateType = USER_AGGREGATE_TYPE;
  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserActivatedEventPayload,
  ) {
    super(aggregateId);
  }
}
