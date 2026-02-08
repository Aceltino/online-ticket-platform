import { DomainEvent } from './domain-event';

export class UserCreatedEvent implements DomainEvent {
  name = 'user.created';
  occurredAt = new Date();

  constructor(
    public readonly payload: {
      userId: string;
      email: string;
      role: string;
    }
  ) {}
}
