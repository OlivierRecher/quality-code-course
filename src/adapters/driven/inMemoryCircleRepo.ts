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
        if (!newCircle.members) {
            newCircle.members = [];
        }
        circles.push(newCircle);
        return newCircle;
    }

    async update(circle: Circle): Promise<void> {
        const index = circles.findIndex(c => c.id === circle.id);
        if (index !== -1) {
            circles[index] = circle;
        }
    }

    async findCirclesByUserId(userId: string): Promise<Circle[]> {
        return circles.filter(circle => circle.members?.some(member => member.id === userId));
    }
}