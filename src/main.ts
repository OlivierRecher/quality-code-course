import express from 'express';
import userController from './adapters/driving/userController';

const app = express();
app.use(express.json());

app.use('/users', userController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});