import { AppDataSource } from './app';

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
