import { Request, Response } from 'express';
import { AppDataSource } from '../app';
import { Task } from '../entities/Task';

const taskRepository = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, priority, due_date } = req.body;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.due_date = new Date(due_date);
    task.user = { id: req.user.id } as any;

    try {
        await taskRepository.save(task);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    const { status, priority, due_date, search } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (due_date) query.due_date = due_date;
    if (search) query.title = search;

    try {
        const tasks = await taskRepository.find({
            where: query,
            relations: ['user']
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;

    try {
        const task = await taskRepository.findOneBy({ id: parseInt(taskId) });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;

        await taskRepository.save(task);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    try {
        const task = await taskRepository.findOneBy({ id: parseInt(taskId) });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await taskRepository.remove(task);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};
