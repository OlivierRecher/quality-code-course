import express, { Express } from "express";
import { UserPort } from "../../ports/driving/userPort";

const router = express.Router();

export class UserController {
    private readonly service: UserPort;

    constructor(private readonly userService: UserPort) {
        this.service = userService;
    }

    registerRoutes(app: Express) {
        router.get("/users", this.getAllUsers.bind(this));
        router.post("/users", this.createUser.bind(this));
        router.get("/users/:id", this.getUser.bind(this));
    }

    async getAllUsers(req: express.Request, res: express.Response) {
        const users = await this.service.listUsers();
        res.json(users);
    }

    async createUser(req: express.Request, res: express.Response) {
        const user = req.body;
        const created = await this.service.createUser(user);
        res.status(201).json(created);
    }

    async getUser(req: express.Request, res: express.Response) {
        const id = req.params.id as string;
        const found = await this.service.getUser(id);
        if (!found) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(found);
    }
}
