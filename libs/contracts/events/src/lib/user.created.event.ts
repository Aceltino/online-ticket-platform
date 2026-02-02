export interface UserCreatedEvent {
  name: 'UserCreated';
  payload: {
    userId: string;
    email: string;
    role: string;
  };
}
