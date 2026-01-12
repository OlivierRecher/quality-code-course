import express from 'express';
import { InMemoryUserRepo } from './adapters/driven/inMemoryUserRepo';
import { UserService } from './services/userService';
import { UserController } from './adapters/driving/userController';

const app = express();
app.use(express.json());

const userService = new UserService(new InMemoryUserRepo());
const userController = new UserController(userService);
userController.registerRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});