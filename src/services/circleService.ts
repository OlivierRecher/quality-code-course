import { Circle } from "../domain/circle";
import { CirclePort } from "../ports/driving/circlePort";
import { CircleRepositoryPort } from "../ports/driven/circleRepoPort";

import { UserRepositoryPort } from "../ports/driven/userRepoPort";

export class CircleService implements CirclePort {
    private readonly repo: CircleRepositoryPort;
    private readonly userRepo: UserRepositoryPort;

    constructor(repo: CircleRepositoryPort, userRepo: UserRepositoryPort) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    async getCircle(id: string): Promise<Circle | undefined> {
        return this.repo.findById(id);
    }

    async createCircle(circle: Omit<Circle, 'id'>): Promise<Circle> {
        return this.repo.save(circle);
    }

    async addMember(circleId: string, userId: string): Promise<void> {
        const circle = await this.repo.findById(circleId);
        if (!circle) throw new Error("Circle not found");

        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error("User not found");

        if (!circle.members) circle.members = [];

        if (circle.members.some(m => m.id === user.id)) {
            throw new Error("User is already a member of the circle");
        }
        circle.members.push(user);
        await this.repo.update(circle);
    }
}