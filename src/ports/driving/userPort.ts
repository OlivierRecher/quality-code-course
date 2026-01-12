import { User } from "../../domain/user";

export interface UserPort {
    listUsers(): Promise<User[]>;
    getUser(id: string): Promise<User | undefined>;
    createUser(user: User): Promise<void>;
}