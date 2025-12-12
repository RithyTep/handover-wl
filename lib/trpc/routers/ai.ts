import { z } from "zod";
import { router, publicMutation } from "@/server/trpc/server";
import OpenAI from "openai";
import {
  fetchTicketComments,
  getLatestWLTCComment,
} from "@/lib/services/jira";

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

const SYSTEM_PROMPT = `You are a precise assistant for creating handover notes based on Jira ticket analysis.

Rules for generating status:
- If there's a WL_TC/WL_AM/WL_PO comment indicating active work: use status like "Fixing...", "Investigating...", "Testing..."
- If comment mentions next release or deployment: use "Include next release"
- If comment mentions waiting for customer/PO: use "Waiting for customer feedback" or "Checking with PO"
- If there's NO WL team comment (only bot like "Ticket Summary Analyst"): use "Not yet check"
- Base the status on what the WL team member actually found/is doing

Rules for generating action:
- If no WL team comment: use "Can check tomorrow" or "[Assignee] to check"
- If WL team is actively working: describe what they're doing, e.g., "[Name] handling", "[Name] fixing callback issue"
- If waiting for someone: use "Follow up [person]"

Return JSON with "status" and "action" fields (max 20 words each).`;

export const aiRouter = router({
  autofill: publicMutation
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

      const model =
        AI_PROVIDER === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

      const comments = await fetchTicketComments(input.ticket.key);
      const latestWLComment = getLatestWLTCComment(comments);

      let contextInfo = "";
      if (latestWLComment) {
        contextInfo = `\n\nLatest WL team comment by ${latestWLComment.author}:\n"${latestWLComment.text.slice(0, 500)}"`;
      } else {
        contextInfo = "\n\nNo WL team comments found (only bot comments like 'Ticket Summary Analyst' exist).";
      }

      const prompt = `Generate handover notes for ticket:
- Key: ${input.ticket.key}
- Summary: ${input.ticket.summary}
- Jira Status: ${input.ticket.status}
- Assignee: ${input.ticket.assignee || "Unassigned"}${contextInfo}`;

      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
          status: (parsed.status || "Not yet check").slice(0, 200),
          action: (parsed.action || "Can check tomorrow").slice(0, 200),
        },
      };
    }),
});
