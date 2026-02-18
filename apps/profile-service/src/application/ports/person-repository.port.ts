import { Person } from '../../domain/entities/person.entity';

export interface IPersonRepository {
  create(person: Person): Promise<void>;
  findByUserId(userId: string): Promise<Person | null>;
  update(person: Person): Promise<void>;
  findByDocument(type: string, number: string): Promise<Person | null>;
}
