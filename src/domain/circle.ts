import { User } from "./user";

export interface Circle {
    id: string;
    name: string;
    type: string;
    members: User[];
}