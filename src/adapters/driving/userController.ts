import express from "express";
import { InMemoryUserRepo } from "../driven/inMemoryUserRepo";
import { UserService } from "../../services/userService";

const router = express.Router();

const repo = new InMemoryUserRepo();
const userService = new UserService(repo);

router.get("/", async (req, res) => {
    const users = await userService.listUsers();
    res.json(users);
});

router.post("/", async (req, res) => {
    const user = req.body;
    const created = await userService.createUser(user);
    res.status(201).json(created);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const found = await userService.getUser(id);
    if (!found) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(found);
});

export default router;
