import { Circle } from "../../domain/circle";

export interface CircleRepositoryPort {
    findById(id: string): Promise<Circle | undefined>;
    save(circle: Omit<Circle, 'id'>): Promise<Circle>;
    update(circle: Circle): Promise<void>;
    findCirclesByUserId(userId: string): Promise<Circle[]>;
}
