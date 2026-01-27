import { DomainEvent } from './domain-event';

export class UserCreatedEvent implements DomainEvent {
  name = 'UserCreated';
  occurredAt = new Date();

  constructor(
    public readonly payload: {
      userId: string;
      email: string;
      role: string;
    }
  ) {}
}
