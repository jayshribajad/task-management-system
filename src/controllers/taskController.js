"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const app_1 = require("../app");
const Task_1 = require("../entities/Task");
const taskRepository = app_1.AppDataSource.getRepository(Task_1.Task);
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, due_date } = req.body;
    const task = new Task_1.Task();
    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.due_date = new Date(due_date);
    task.user = { id: req.user.id };
    try {
        yield taskRepository.save(task);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, priority, due_date, search } = req.query;
    const query = {};
    if (status)
        query.status = status;
    if (priority)
        query.priority = priority;
    if (due_date)
        query.due_date = due_date;
    if (search)
        query.title = search;
    try {
        const tasks = yield taskRepository.find({
            where: query,
            relations: ['user']
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;
    try {
        const task = yield taskRepository.findOneBy({ id: parseInt(taskId) });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        yield taskRepository.save(task);
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const task = yield taskRepository.findOneBy({ id: parseInt(taskId) });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        yield taskRepository.remove(task);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});
exports.deleteTask = deleteTask;
