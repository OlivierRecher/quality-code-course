import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the TypeScript Backend!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})