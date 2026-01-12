import { CircleRepositoryPort } from "../../ports/driven/circleRepoPort";
import { Circle } from "../../domain/circle";

const circles: Circle[] = [];

export class InMemoryCircleRepo implements CircleRepositoryPort {

    async findById(id: string): Promise<Circle | undefined> {
        return circles.find(u => u.id === id);
    }
}