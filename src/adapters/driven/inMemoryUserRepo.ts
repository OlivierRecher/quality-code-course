import { UserRepositoryPort } from "../../ports/driven/userRepoPort";
import { User } from "../../domain/user";
import { v4 as uuidv4 } from 'uuid';

export class InMemoryUserRepo implements UserRepositoryPort {
    private users: User[];

    constructor(users: User[] = []) {
        this.users = users;
    }

    async findAll(): Promise<User[]> {
        return this.users.slice();
    }

    async findById(id: string): Promise<User | undefined> {
        return this.users.find(u => u.id === id);
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = { id: uuidv4(), ...user };
        this.users.push(newUser);
        return newUser;
    }

    async delete(id: string): Promise<void> {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }
}
