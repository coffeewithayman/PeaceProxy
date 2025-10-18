import { type Message, type InsertMessage, type ParentPair, type InsertParentPair } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createParentPair(pair: InsertParentPair): Promise<ParentPair>;
  getParentPair(id: string): Promise<ParentPair | undefined>;
  getAllParentPairs(): Promise<ParentPair[]>;
  findPartnerPhone(senderPhone: string): Promise<string | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: string): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;
  private parentPairs: Map<string, ParentPair>;

  constructor() {
    this.messages = new Map();
    this.parentPairs = new Map();
  }

  async createParentPair(insertPair: InsertParentPair): Promise<ParentPair> {
    const id = randomUUID();
    const pair: ParentPair = {
      ...insertPair,
      id,
      createdAt: new Date(),
    };
    this.parentPairs.set(id, pair);
    return pair;
  }

  async getParentPair(id: string): Promise<ParentPair | undefined> {
    return this.parentPairs.get(id);
  }

  async getAllParentPairs(): Promise<ParentPair[]> {
    return Array.from(this.parentPairs.values());
  }

  async findPartnerPhone(senderPhone: string): Promise<string | undefined> {
    for (const pair of this.parentPairs.values()) {
      if (pair.phone1 === senderPhone) return pair.phone2;
      if (pair.phone2 === senderPhone) return pair.phone1;
    }
    return undefined;
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
