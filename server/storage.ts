import { users, tasks, contexts, type User, type InsertUser, type Task, type InsertTask, type Context, type InsertContext, type TaskWithContext } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getContexts(): Promise<Context[]>;
  getContext(id: number): Promise<Context | undefined>;
  getContextByName(name: string): Promise<Context | undefined>;
  createContext(context: InsertContext): Promise<Context>;
  
  getTasks(): Promise<TaskWithContext[]>;
  getTask(id: number): Promise<TaskWithContext | undefined>;
  getTasksByContext(contextId: number): Promise<TaskWithContext[]>;
  createTask(task: InsertTask): Promise<TaskWithContext>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<TaskWithContext>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contexts: Map<number, Context>;
  private tasks: Map<number, Task>;
  private currentUserId: number;
  private currentContextId: number;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.contexts = new Map();
    this.tasks = new Map();
    this.currentUserId = 1;
    this.currentContextId = 1;
    this.currentTaskId = 1;
    
    // Add some default contexts
    this.createDefaultContexts();
  }

  private createDefaultContexts() {
    const defaultContexts = [
      { name: "Work", color: "#3b82f6" },
      { name: "Personal", color: "#10b981" },
      { name: "Learning", color: "#f59e0b" },
      { name: "Health", color: "#ef4444" },
    ];
    
    for (const contextData of defaultContexts) {
      const id = this.currentContextId++;
      const context: Context = { 
        ...contextData, 
        id,
        color: contextData.color || "#3b82f6"
      };
      this.contexts.set(id, context);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getContexts(): Promise<Context[]> {
    return Array.from(this.contexts.values());
  }

  async getContext(id: number): Promise<Context | undefined> {
    return this.contexts.get(id);
  }

  async getContextByName(name: string): Promise<Context | undefined> {
    return Array.from(this.contexts.values()).find(
      (context) => context.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createContext(insertContext: InsertContext): Promise<Context> {
    const id = this.currentContextId++;
    const context: Context = { 
      ...insertContext, 
      id,
      color: insertContext.color || "#3b82f6"
    };
    this.contexts.set(id, context);
    return context;
  }

  async getTasks(): Promise<TaskWithContext[]> {
    const tasks = Array.from(this.tasks.values());
    return Promise.all(tasks.map(async (task) => {
      const context = task.contextId ? await this.getContext(task.contextId) : undefined;
      return { ...task, context };
    }));
  }

  async getTask(id: number): Promise<TaskWithContext | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const context = task.contextId ? await this.getContext(task.contextId) : undefined;
    return { ...task, context };
  }

  async getTasksByContext(contextId: number): Promise<TaskWithContext[]> {
    const tasks = Array.from(this.tasks.values()).filter(task => task.contextId === contextId);
    const context = await this.getContext(contextId);
    return tasks.map(task => ({ ...task, context }));
  }

  async createTask(insertTask: InsertTask): Promise<TaskWithContext> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id,
      comments: insertTask.comments || null,
      contextId: insertTask.contextId || null
    };
    this.tasks.set(id, task);
    
    const context = task.contextId ? await this.getContext(task.contextId) : undefined;
    return { ...task, context };
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<TaskWithContext> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    const updatedTask: Task = { 
      ...existingTask, 
      ...updateData,
      comments: updateData.comments !== undefined ? updateData.comments : existingTask.comments,
      contextId: updateData.contextId !== undefined ? updateData.contextId : existingTask.contextId
    };
    this.tasks.set(id, updatedTask);
    
    const context = updatedTask.contextId ? await this.getContext(updatedTask.contextId) : undefined;
    return { ...updatedTask, context };
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
