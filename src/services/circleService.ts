import { Circle } from "../domain/circle";
import { CirclePort } from "../ports/driving/circlePort";
import { CircleRepositoryPort } from "../ports/driven/circleRepoPort";

export class CircleService implements CirclePort {
    private readonly repo: CircleRepositoryPort;

    constructor(repo: CircleRepositoryPort) {
        this.repo = repo;
    }

    async getCircle(id: string): Promise<Circle | undefined> {
        return this.repo.findById(id);
    }
}