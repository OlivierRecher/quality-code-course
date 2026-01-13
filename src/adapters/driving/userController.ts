import express, { Express } from "express";
import { UserPort } from "../../ports/driving/userPort";

export class UserController {
    private readonly service: UserPort;

    constructor(private readonly userService: UserPort) {
        this.service = userService;
    }

    registerRoutes(app: Express): void {
        app.get("/users", this.getAllUsers.bind(this));
        app.post("/users", this.createUser.bind(this));
        app.get("/users/:id", this.getUser.bind(this));
        app.delete("/users/:id", this.deleteUser.bind(this));
        app.get("/users/:id/circles", this.getCircles.bind(this));
    }

    async getAllUsers(req: express.Request, res: express.Response): Promise<void> {
        const users = await this.service.listUsers();
        res.json(users);
    }

    async createUser(req: express.Request, res: express.Response): Promise<void> {
        const user = req.body;
        const created = await this.service.createUser(user);
        res.status(201).json(created);
    }

    async getUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params.id as string;
        const found = await this.service.getUser(id);
        if (!found) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(found);
    }

    async deleteUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params.id as string;
        await this.service.deleteUser(id);
        res.status(204).send();
    }

    async getCircles(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params.id as string;
        try {
            const circles = await this.service.getCircles(id);
            res.json(circles);
        } catch (e) {
            if (e instanceof Error && e.message === "User not found") {
                res.status(404).json({ message: e.message });
                return;
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
