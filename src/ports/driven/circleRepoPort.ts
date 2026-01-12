import { Circle } from "../../domain/circle";

export interface CircleRepositoryPort {
    findById(id: string): Promise<Circle | undefined>;
}
