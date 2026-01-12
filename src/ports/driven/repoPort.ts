import { User } from "../../domain/user.js";

export interface UserRepositoryPort {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    save(user: User): Promise<User>;
}
