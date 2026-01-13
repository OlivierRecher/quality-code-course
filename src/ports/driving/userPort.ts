import { User } from "../../domain/user";
import { Circle } from "../../domain/circle";

export interface UserPort {
    listUsers(): Promise<User[]>;
    getUser(id: string): Promise<User | undefined>;
    createUser(user: Omit<User, 'id'>): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getCircles(userId: string): Promise<Circle[]>;
}