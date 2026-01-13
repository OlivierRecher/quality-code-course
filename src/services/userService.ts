import { User } from "../domain/user";
import { Circle } from "../domain/circle";
import { UserPort } from "../ports/driving/userPort";
import { UserRepositoryPort } from "../ports/driven/userRepoPort";
import { CircleRepositoryPort } from "../ports/driven/circleRepoPort";

export class UserService implements UserPort {
    private readonly repo: UserRepositoryPort;
    private readonly circleRepo: CircleRepositoryPort;

    constructor(repo: UserRepositoryPort, circleRepo: CircleRepositoryPort) {
        this.repo = repo;
        this.circleRepo = circleRepo;
    }

    async listUsers(): Promise<User[]> {
        return this.repo.findAll();
    }

    async getUser(id: string): Promise<User | undefined> {
        return this.repo.findById(id);
    }

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        return this.repo.save(user);
    }

    async deleteUser(id: string): Promise<void> {
        return this.repo.delete(id);
    }

    async getCircles(userId: string): Promise<Circle[]> {
        const user = await this.repo.findById(userId);
        if (!user) throw new Error("User not found");
        return this.circleRepo.findCirclesByUserId(userId);
    }
}