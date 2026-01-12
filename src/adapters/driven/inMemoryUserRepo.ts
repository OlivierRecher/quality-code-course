import { UserRepositoryPort } from "../../ports/driven/repoPort.js";
import { User } from "../../domain/user.js";
import { v4 as uuidv4 } from 'uuid';

const users: User[] = [];

export class InMemoryUserRepo implements UserRepositoryPort {

    async findAll(): Promise<User[]> {
        return users.slice();
    }

    async findById(id: string): Promise<User | undefined> {
        return users.find(u => u.id === id);
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = { id: uuidv4(), ...user };
        users.push(newUser);
        return newUser;
    }
}
