import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Task } from '../models/Task';

export class TasksController {
  public static async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const status = req.query.status as string;

      const filter: any = { userId };
      if (status) filter.status = status;

      const tasks = await Task.find(filter).sort({ createdAt: -1 });
      res.status(200).json({ tasks });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch tasks.' });
    }
  }

  public static async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { title, description, dueDate, priority } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Task title is required.' });
        return;
      }

      const task = await Task.create({
        userId,
        title: title.trim(),
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || 'medium',
        status: 'pending'
      });

      res.status(201).json({ task });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create task.' });
    }
  }

  public static async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { title, description, status, dueDate, priority } = req.body;

      const task = await Task.findOneAndUpdate(
        { _id: id, userId },
        {
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(priority && { priority })
        },
        { new: true }
      );

      if (!task) {
        res.status(404).json({ error: 'Task not found.' });
        return;
      }

      res.status(200).json({ task });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update task.' });
    }
  }

  public static async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const result = await Task.findOneAndDelete({ _id: id, userId });
      if (!result) {
        res.status(404).json({ error: 'Task not found.' });
        return;
      }

      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete task.' });
    }
  }
}

