import { DomainEvent } from '../../domain/events/domain-event';

export interface EventDispatcher {
  dispatch(event: DomainEvent): Promise<void>;
}
