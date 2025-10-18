import { type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: string): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;

  constructor() {
    this.messages = new Map();
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
