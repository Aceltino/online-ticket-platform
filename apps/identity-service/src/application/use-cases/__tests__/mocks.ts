import { IUserRepository } from '../../ports/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';

export class FakeUserRepository implements IUserRepository {
    private users: User[] = [];

    async findByEmail(email: Email): Promise<User | null> {
        return this.users.find(u => u.getEmail() === email.getValue()) ?? null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.getId() === id) ?? null;
    }

    async save(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.getId() === user.getId());

        if (index >= 0) {
            this.users[index] = user;
        } else {
            this.users.push(user);
        }
    }


    async list(): Promise<User[]> {
        return this.users;
    }
}
