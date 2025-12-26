import express, { Application, Request, Response } from 'express';
import { postRouter } from './modules/post/post.routes';

const app: Application = express();
app.use(express.json());

app.use('/posts', postRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
})

export default app;
