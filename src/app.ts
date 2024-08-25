import express from 'express';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Task } from './entities/Task';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { authenticateToken } from './middleware/authMiddleware';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes); 

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Task],
    synchronize: true,
    logging: false,
});
