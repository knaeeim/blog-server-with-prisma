import express, { Application, Request, Response } from 'express';
import { postRouter } from './modules/post/post.routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { commentRoutes } from './modules/comment/comment.routes';
import errorHandler from './middlewares/globalErrorHandler';

const app: Application = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(cors({
    origin : process.env.APP_URL || 'http://localhost:3000', 
    credentials : true
}))

app.use(express.json());

app.use('/posts', postRouter);

app.use('/comments', commentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
})

app.use(errorHandler);

export default app;
