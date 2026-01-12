import express from "express";
import { InMemoryCircleRepo } from "../driven/inMemoryCircleRepo";

import { CircleService } from "../../services/circleService";

const router = express.Router();

const repo = new InMemoryCircleRepo();
const circleService = new CircleService(repo);

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const found = await circleService.getCircle(id);
    if (!found) {
        return res.status(404).json({ message: "Circle not found" });
    }
    res.json(found);
});

export default router;