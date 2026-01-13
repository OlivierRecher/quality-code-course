import express, { Express } from "express";
import { CirclePort } from "../../ports/driving/circlePort";

export class CircleController {
    private readonly service: CirclePort;

    constructor(circleService: CirclePort) {
        this.service = circleService;
    }

    registerRoutes(app: Express) {
        app.get("/circles/:id", this.getCircle.bind(this));
        app.post("/circles", this.createCircle.bind(this));
        app.put("/circles/:id/users/:userId", this.addMember.bind(this));
    }

    async getCircle(req: express.Request, res: express.Response) {
        const id = req.params.id as string;
        const found = await this.service.getCircle(id);
        if (!found) {
            return res.status(404).json({ message: "Circle not found" });
        }
        res.json(found);
    }

    async createCircle(req: express.Request, res: express.Response) {
        const circle = req.body;
        const created = await this.service.createCircle(circle);
        res.status(201).json(created);
    }

    async addMember(req: express.Request, res: express.Response) {
        const id = req.params.id as string;
        const userId = req.params.userId as string;
        try {
            await this.service.addMember(id, userId);
            res.status(204).send();
        } catch (e: any) {
            if (e.message === "Circle not found" || e.message === "User not found") {
                return res.status(404).json({ message: e.message });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}