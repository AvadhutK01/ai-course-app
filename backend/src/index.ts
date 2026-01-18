/// <reference path="./types/express.d.ts" />
import express, { Express } from 'express';
import { connectDB } from './utils/db';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
