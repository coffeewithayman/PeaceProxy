import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { moderateMessage } from "./openai-client";
import { getTwilioClient, getTwilioFromPhoneNumber } from "./twilio-client";
import { insertMessageSchema } from "@shared/schema";
import type { ModerationResult } from "./openai-client";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/parent-pairs", async (req, res) => {
    try {
      const pair = await storage.createParentPair(req.body);
      res.json(pair);
    } catch (error) {
      console.error("Error creating parent pair:", error);
      res.status(500).json({ error: "Failed to create parent pair" });
    }
  });

  app.get("/api/parent-pairs", async (_req, res) => {
    try {
      const pairs = await storage.getAllParentPairs();
      res.json(pairs);
    } catch (error) {
      console.error("Error fetching parent pairs:", error);
      res.status(500).json({ error: "Failed to fetch parent pairs" });
    }
  });

  app.post("/api/sms/webhook", async (req, res) => {
    try {
      const { From, To, Body } = req.body;

      if (!From || !To || !Body) {
        return res.status(400).send("Missing required fields");
      }

      const recipientPhone = await storage.findPartnerPhone(From);

      if (!recipientPhone) {
        console.error(`No partner phone found for sender: ${From}`);
        const twilioClient = await getTwilioClient();
        const fromNumber = await getTwilioFromPhoneNumber();
        
        await twilioClient.messages.create({
          body: "Your phone number is not registered in the co-parent messaging system. Please contact support to set up your account.",
          from: fromNumber,
          to: From,
        });
        
        return res.status(200).send("OK");
      }

      const message = await storage.createMessage({
        fromPhone: From,
        toPhone: To,
        recipientPhone: recipientPhone,
        content: Body,
        status: "pending",
        moderationResult: null,
        feedback: null,
      });

      const moderationResult: ModerationResult = await moderateMessage(Body);

      const status = moderationResult.isAppropriate ? "approved" : "blocked";
      const feedback = moderationResult.isAppropriate
        ? "Message approved and forwarded"
        : generateFeedbackMessage(moderationResult);

      await storage.updateMessage(message.id, {
        status,
        moderationResult: JSON.stringify(moderationResult),
        feedback,
      });

      const twilioClient = await getTwilioClient();
      const fromNumber = await getTwilioFromPhoneNumber();

      if (moderationResult.isAppropriate) {
        await twilioClient.messages.create({
          body: Body,
          from: fromNumber,
          to: recipientPhone,
        });
        console.log(`Message approved and forwarded from ${From} to ${recipientPhone}`);
      } else {
        await twilioClient.messages.create({
          body: feedback,
          from: fromNumber,
          to: From,
        });
        console.log(`Message blocked from ${From}. Feedback sent.`);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing SMS webhook:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

function generateFeedbackMessage(moderation: ModerationResult): string {
  let feedback = "Your message was not delivered because it contains content that may escalate conflict.\n\n";

  if (moderation.issues.length > 0) {
    feedback += "Issues detected:\n";
    moderation.issues.forEach((issue, idx) => {
      feedback += `${idx + 1}. ${issue}\n`;
    });
    feedback += "\n";
  }

  if (moderation.suggestions.length > 0) {
    feedback += "Suggestions for improvement:\n";
    moderation.suggestions.forEach((suggestion, idx) => {
      feedback += `${idx + 1}. ${suggestion}\n`;
    });
    feedback += "\n";
  }

  feedback += "Please rephrase your message in a respectful, factual manner focused on your children's needs.";

  return feedback;
}
