import express, { Application, Request, Response } from 'express';
import { postRouter } from './modules/post/post.routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app: Application = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use(express.json());

app.use('/posts', postRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
})

export default app;
