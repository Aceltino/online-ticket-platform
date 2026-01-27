export interface DomainEvent {
  name: string;
  occurredAt: Date;
  payload: unknown;
}
