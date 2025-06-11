import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use(errorHandler as express.ErrorRequestHandler);

export default app;
