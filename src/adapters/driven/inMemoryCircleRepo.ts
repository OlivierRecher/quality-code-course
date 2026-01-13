import { CircleRepositoryPort } from "../../ports/driven/circleRepoPort";
import { Circle } from "../../domain/circle";
import { v4 as uuidv4 } from 'uuid';

export class InMemoryCircleRepo implements CircleRepositoryPort {
    private circles: Circle[];

    constructor(circles: Circle[] = []) {
        this.circles = circles;
    }

    async findById(id: string): Promise<Circle | undefined> {
        return this.circles.find(u => u.id === id);
    }

    async save(circle: Omit<Circle, 'id'>): Promise<Circle> {
        const newCircle = { id: uuidv4(), ...circle };
        if (!newCircle.members) {
            newCircle.members = [];
        }
        this.circles.push(newCircle);
        return newCircle;
    }

    async update(circle: Circle): Promise<void> {
        const index = this.circles.findIndex(c => c.id === circle.id);
        if (index !== -1) {
            this.circles[index] = circle;
        }
    }

    async findCirclesByUserId(userId: string): Promise<Circle[]> {
        return this.circles.filter(circle => circle.members?.some(member => member.id === userId));
    }
}