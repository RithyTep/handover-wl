import { z } from "zod";
import { router, publicProcedure } from "../server";
import OpenAI from "openai";

const ticketSchema = z.object({
  key: z.string(),
  summary: z.string(),
  status: z.string(),
  assignee: z.string().optional(),
  created: z.string().optional(),
  dueDate: z.string().optional(),
  wlMainTicketType: z.string().optional(),
  wlSubTicketType: z.string().optional(),
  customerLevel: z.string().optional(),
});

const AI_PROVIDER = process.env.AI_PROVIDER || "groq";

const getAIClient = () => {
  if (AI_PROVIDER === "groq") {
    return new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  } else if (AI_PROVIDER === "openai") {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return null;
};

// Simplified version - full implementation would include ticket history fetching
export const aiRouter = router({
  autofill: publicProcedure
    .input(
      z.object({
        ticket: ticketSchema,
      })
    )
    .mutation(async ({ input }) => {
      const client = getAIClient();
      if (!client) {
        throw new Error("AI client not configured");
      }

      const model = AI_PROVIDER === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

      const prompt = `Generate handover notes for ticket ${input.ticket.key}. Status: ${input.ticket.status}, Summary: ${input.ticket.summary}. Return JSON with "status" and "action" fields (max 20 words each).`;

      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are a precise assistant for creating handover notes." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const suggestion = completion.choices[0]?.message?.content;
      if (!suggestion) {
        throw new Error("No response from AI");
      }

      const parsed = JSON.parse(suggestion);
      return {
        suggestion: {
          status: (parsed.status || "Pending review").slice(0, 200),
          action: (parsed.action || "Review ticket").slice(0, 200),
        },
      };
    }),
});
