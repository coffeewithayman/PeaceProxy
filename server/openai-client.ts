import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface ModerationResult {
  isAppropriate: boolean;
  issues: string[];
  suggestions: string[];
  tone: string;
  severity: "low" | "medium" | "high";
}

export async function moderateMessage(content: string): Promise<ModerationResult> {
  const prompt = `You are an AI moderator for co-parent communication. Analyze the following message for emotional content, hostility, negativity, or inappropriate language that could escalate conflict between co-parents.

Message: "${content}"

Provide your analysis in the following JSON format:
{
  "isAppropriate": boolean (true if message is appropriate, false if it should be blocked),
  "issues": string[] (list of specific problems found, empty if appropriate),
  "suggestions": string[] (constructive suggestions for rephrasing, empty if appropriate),
  "tone": string (describe the overall tone: neutral, friendly, frustrated, hostile, etc.),
  "severity": "low" | "medium" | "high" (severity of issues found, low if appropriate)
}

Guidelines:
- Block messages that contain: insults, blame, sarcasm, passive-aggression, threats, guilt-tripping, emotional manipulation
- Approve messages that are: factual, respectful, focused on children's needs, solution-oriented
- Consider context: discussing child schedules, health, education, finances should be neutral and business-like`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional mediator specialized in high-conflict co-parenting communication. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      isAppropriate: result.isAppropriate ?? true,
      issues: result.issues ?? [],
      suggestions: result.suggestions ?? [],
      tone: result.tone ?? "unknown",
      severity: result.severity ?? "low",
    };
  } catch (error) {
    console.error("OpenAI moderation error:", error);
    return {
      isAppropriate: false,
      issues: ["Error analyzing message - defaulting to block for safety"],
      suggestions: ["Please try sending your message again"],
      tone: "error",
      severity: "high",
    };
  }
}
