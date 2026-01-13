import { Circle } from "../../domain/circle";

export interface CirclePort {
    getCircle(id: string): Promise<Circle | undefined>;
    createCircle(circle: Omit<Circle, 'id'>): Promise<Circle>;
}