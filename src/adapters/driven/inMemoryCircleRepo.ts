import { CircleRepositoryPort } from "../../ports/driven/circleRepoPort";
import { Circle } from "../../domain/circle";
import { v4 as uuidv4 } from 'uuid';

const circles: Circle[] = [];

export class InMemoryCircleRepo implements CircleRepositoryPort {

    async findById(id: string): Promise<Circle | undefined> {
        return circles.find(u => u.id === id);
    }

    async save(circle: Omit<Circle, 'id'>): Promise<Circle> {
        const newCircle = { id: uuidv4(), ...circle };
        circles.push(newCircle);
        return newCircle;
    }
}