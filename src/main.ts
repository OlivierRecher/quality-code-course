import express from 'express';
import { InMemoryUserRepo } from './adapters/driven/inMemoryUserRepo';
import { UserService } from './services/userService';
import { UserController } from './adapters/driving/userController';
import { InMemoryCircleRepo } from './adapters/driven/inMemoryCircleRepo';
import { CircleService } from './services/circleService';
import { CircleController } from './adapters/driving/circleController';

const app = express();
app.use(express.json());

const userRepo = new InMemoryUserRepo();
const circleRepo = new InMemoryCircleRepo();
const userService = new UserService(userRepo, circleRepo);
const userController = new UserController(userService);
userController.registerRoutes(app);

const circleService = new CircleService(circleRepo, userRepo);
const circleController = new CircleController(circleService);
circleController.registerRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});