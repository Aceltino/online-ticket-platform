import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

export interface IUserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
  save(user: User): Promise<void>;
}
