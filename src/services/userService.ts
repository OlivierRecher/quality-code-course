import { User } from "../domain/user";
import { UserPort } from "../ports/driving/userPort";
import { UserRepositoryPort } from "../ports/driven/userRepoPort";

export class UserService implements UserPort {
    private readonly repo: UserRepositoryPort;

    constructor(repo: UserRepositoryPort) {
        this.repo = repo;
    }

    async listUsers(): Promise<User[]> {
        return this.repo.findAll();
    }

    async getUser(id: string): Promise<User | undefined> {
        return this.repo.findById(id);
    }

    async createUser(user: User): Promise<void> {
        await this.repo.save(user);
    }
}