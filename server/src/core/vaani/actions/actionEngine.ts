import { Note } from '../../../models/Note';
import { Task } from '../../../models/Task';
import { ExtractedEntities } from '../entities/entityExtractor';

export interface ActionResult {
  success: boolean;
  action: string;
  data?: any;
  message: string;
  displayContent?: string;
}

export class ActionEngine {
  /**
   * Safe Math Evaluator (No eval!)
   */
  public static evaluateMath(expression: string): { result: number; expression: string } | null {
    try {
      // Normalize common spoken words to math operators
      let clean = expression
        .toLowerCase()
        .replace(/plus|jod|vatta/g, '+')
        .replace(/minus|ghata|ochha/g, '-')
        .replace(/times|multiplied\s+by|guna/g, '*')
        .replace(/divided\s+by|bhaag/g, '/')
        .replace(/power|to\s+the\s+power\s+of|\^/g, '**')
        .trim();

      // Percentage pattern: "20% of 500" or "500 * 20%" or "500 ka 20%"
      const percentMatch1 = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|ka|ki|ke|na|nu)?\s*(\d+(?:\.\d+)?)/i);
      if (percentMatch1) {
        const pct = parseFloat(percentMatch1[1]);
        const base = parseFloat(percentMatch1[2]);
        const res = (pct / 100) * base;
        return { result: Math.round(res * 1000) / 1000, expression: `${pct}% of ${base}` };
      }

      const percentMatch2 = clean.match(/(\d+(?:\.\d+)?)\s*(?:ka|ki|ke|na|nu)\s*(\d+(?:\.\d+)?)\s*%/i);
      if (percentMatch2) {
        const base = parseFloat(percentMatch2[1]);
        const pct = parseFloat(percentMatch2[2]);
        const res = (pct / 100) * base;
        return { result: Math.round(res * 1000) / 1000, expression: `${pct}% of ${base}` };
      }

      // Sanitize: allow only digits, decimal, operators, parentheses, spaces
      if (!/^[0-9+\-*/().\s^%]+$/.test(clean)) {
        return null;
      }

      // Safe recursive descent or Function with strict bounds
      const sanitized = clean.replace(/[^0-9+\-*/().]/g, '');
      if (!sanitized) return null;

      // Safe evaluation using Function with no globals
      const calcFn = new Function(`"use strict"; return (${sanitized});`);
      const val = calcFn();

      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        return { result: Math.round(val * 10000) / 10000, expression: sanitized };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Unit Converter
   */
  public static convertUnit(value: number, fromUnit: string, toUnit: string): { result: number; fromStr: string; toStr: string } | null {
    const f = fromUnit.toLowerCase();
    const t = toUnit.toLowerCase();

    // Distance
    if ((f === 'km' || f === 'kilometers') && (t === 'miles' || t === 'mile')) {
      return { result: Math.round(value * 0.621371 * 100) / 100, fromStr: `${value} km`, toStr: `${Math.round(value * 0.621371 * 100) / 100} miles` };
    }
    if ((f === 'miles' || f === 'mile') && (t === 'km' || t === 'kilometers')) {
      return { result: Math.round(value * 1.60934 * 100) / 100, fromStr: `${value} miles`, toStr: `${Math.round(value * 1.60934 * 100) / 100} km` };
    }
    if ((f === 'meters' || f === 'm') && (t === 'feet' || t === 'ft')) {
      return { result: Math.round(value * 3.28084 * 100) / 100, fromStr: `${value} meters`, toStr: `${Math.round(value * 3.28084 * 100) / 100} feet` };
    }
    if ((f === 'feet' || f === 'ft') && (t === 'meters' || t === 'm')) {
      return { result: Math.round(value * 0.3048 * 100) / 100, fromStr: `${value} feet`, toStr: `${Math.round(value * 0.3048 * 100) / 100} meters` };
    }

    // Weight
    if ((f === 'kg' || f === 'kilograms') && (t === 'lbs' || t === 'pounds')) {
      return { result: Math.round(value * 2.20462 * 100) / 100, fromStr: `${value} kg`, toStr: `${Math.round(value * 2.20462 * 100) / 100} lbs` };
    }
    if ((f === 'lbs' || f === 'pounds') && (t === 'kg' || t === 'kilograms')) {
      return { result: Math.round(value * 0.453592 * 100) / 100, fromStr: `${value} lbs`, toStr: `${Math.round(value * 0.453592 * 100) / 100} kg` };
    }

    // Temperature
    if (f === 'celsius' && t === 'fahrenheit') {
      const res = Math.round(((value * 9) / 5 + 32) * 10) / 10;
      return { result: res, fromStr: `${value}°C`, toStr: `${res}°F` };
    }
    if (f === 'fahrenheit' && t === 'celsius') {
      const res = Math.round((((value - 32) * 5) / 9) * 10) / 10;
      return { result: res, fromStr: `${value}°F`, toStr: `${res}°C` };
    }

    return null;
  }

  /**
   * Create Note
   */
  public static async createNote(userId: string, title: string, content: string): Promise<ActionResult> {
    try {
      const newNote = await Note.create({
        userId,
        title: title || 'Untitled Note',
        content: content || title,
        tags: ['voice-created', 'assistant']
      });

      return {
        success: true,
        action: 'create_note',
        data: newNote,
        message: `Saved note: "${newNote.title}"`,
        displayContent: newNote.content
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'create_note',
        message: `Failed to save note: ${err.message}`
      };
    }
  }

  /**
   * Retrieve Notes
   */
  public static async getNotes(userId: string, limit = 5): Promise<ActionResult> {
    try {
      const notes = await Note.find({ userId }).sort({ createdAt: -1 }).limit(limit);
      return {
        success: true,
        action: 'get_notes',
        data: notes,
        message: notes.length === 0 ? 'You do not have any saved notes yet.' : `Found ${notes.length} saved notes.`,
        displayContent: notes.map((n, i) => `${i + 1}. ${n.title}: ${n.content}`).join('\n')
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'get_notes',
        message: `Could not retrieve notes: ${err.message}`
      };
    }
  }

  /**
   * Summarize Notes
   */
  public static async summarizeNotes(userId: string): Promise<ActionResult> {
    try {
      const notes = await Note.find({ userId }).sort({ createdAt: -1 }).limit(10);
      if (notes.length === 0) {
        return {
          success: true,
          action: 'summarize_notes',
          message: 'No notes available to summarize. Try creating one by saying "Take a note".'
        };
      }

      const summaryLines = notes.map((n) => `• ${n.title} (${new Date(n.createdAt).toLocaleDateString()}): ${n.content}`);
      return {
        success: true,
        action: 'summarize_notes',
        data: { count: notes.length, notes },
        message: `You have ${notes.length} notes on record. Key topics include: ${notes.slice(0, 3).map(n => n.title).join(', ')}.`,
        displayContent: summaryLines.join('\n')
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'summarize_notes',
        message: `Error summarizing notes: ${err.message}`
      };
    }
  }

  /**
   * Create Task / To-Do
   */
  public static async createTask(userId: string, title: string, dueDate?: Date): Promise<ActionResult> {
    try {
      const newTask = await Task.create({
        userId,
        title,
        status: 'pending',
        dueDate: dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      return {
        success: true,
        action: 'create_task',
        data: newTask,
        message: `Added task: "${newTask.title}"`,
        displayContent: newTask.title
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'create_task',
        message: `Failed to create task: ${err.message}`
      };
    }
  }

  /**
   * List Tasks
   */
  public static async getTasks(userId: string, status?: 'pending' | 'completed'): Promise<ActionResult> {
    try {
      const filter: any = { userId };
      if (status) filter.status = status;
      const tasks = await Task.find(filter).sort({ createdAt: -1 }).limit(10);

      const pendingCount = tasks.filter(t => t.status === 'pending').length;
      return {
        success: true,
        action: 'get_tasks',
        data: tasks,
        message: tasks.length === 0 
          ? 'No tasks found on your list.' 
          : `You have ${pendingCount} pending task${pendingCount === 1 ? '' : 's'}.`,
        displayContent: tasks.map((t, i) => `${i + 1}. [${t.status === 'completed' ? '✓' : ' '}] ${t.title}`).join('\n')
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'get_tasks',
        message: `Could not retrieve tasks: ${err.message}`
      };
    }
  }

  /**
   * Complete Task
   */
  public static async completeTask(userId: string, taskTitleOrId?: string): Promise<ActionResult> {
    try {
      let task = null;
      if (taskTitleOrId) {
        task = await Task.findOne({
          userId,
          status: 'pending',
          title: new RegExp(taskTitleOrId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        });
      }
      if (!task) {
        // Complete latest pending task
        task = await Task.findOne({ userId, status: 'pending' }).sort({ createdAt: -1 });
      }

      if (!task) {
        return {
          success: false,
          action: 'complete_task',
          message: 'No pending task found to complete.'
        };
      }

      task.status = 'completed';
      await task.save();

      return {
        success: true,
        action: 'complete_task',
        data: task,
        message: `Completed task: "${task.title}". Great job!`,
        displayContent: task.title
      };
    } catch (err: any) {
      return {
        success: false,
        action: 'complete_task',
        message: `Failed to complete task: ${err.message}`
      };
    }
  }
}

