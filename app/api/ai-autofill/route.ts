import { NextResponse } from "next/server";
import OpenAI from "openai";

// Support multiple AI providers
const AI_PROVIDER = process.env.AI_PROVIDER || "groq"; // groq, openai, gemini

// Initialize client based on provider
const getAIClient = () => {
  if (AI_PROVIDER === "groq") {
    // Groq uses OpenAI-compatible API
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

// Fetch ticket history and comments from Jira
async function fetchTicketHistory(ticketKey: string) {
  try {
    const JIRA_URL = process.env.JIRA_URL;
    const JIRA_EMAIL = process.env.JIRA_EMAIL;
    const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

    if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
      console.warn("Jira credentials not configured");
      return null;
    }

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    // Fetch issue with comments and changelog
    const response = await fetch(
      `${JIRA_URL}/rest/api/3/issue/${ticketKey}?expand=changelog,comment`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch ticket history:", response.statusText);
      return null;
    }

    const data = await response.json();

    // Helper function to extract comment text recursively from ADF
    const extractCommentText = (comment: any): string => {
      // Try ADF format first
      if (comment.body?.content) {
        let text = '';
        
        const extractFromNode = (node: any): string => {
          let nodeText = '';
          
          // Handle text nodes
          if (node.type === 'text' && node.text) {
            nodeText += node.text + ' ';
          }
          
          // Handle paragraphs, headings, etc.
          if (node.content && Array.isArray(node.content)) {
            for (const child of node.content) {
              nodeText += extractFromNode(child);
            }
          }
          
          // Add line breaks for block elements
          if (['paragraph', 'heading', 'listItem'].includes(node.type)) {
            nodeText += '\n';
          }
          
          return nodeText;
        };
        
        for (const node of comment.body.content) {
          text += extractFromNode(node);
        }
        
        return text.trim();
      }
      
      // Fallback to plain text
      if (typeof comment.body === 'string') {
        return comment.body;
      }
      
      return '';
    };

    // Get last 5 comments with full text, excluding Rovo and bot comments
    const allComments = data.fields?.comment?.comments || [];
    console.log(`Found ${allComments.length} total comments for ${ticketKey}`);

    // Filter out Rovo and bot comments
    const filteredComments = allComments.filter((c: any) => {
      const authorName = (c.author?.displayName || c.author?.name || "Unknown").toLowerCase();
      const isRovoOrBot =
        authorName.includes('rovo') ||
        authorName.includes('bot') ||
        authorName.includes('automation') ||
        c.author?.accountType === 'app';
      return !isRovoOrBot;
    });

    console.log(`Filtered ${allComments.length - filteredComments.length} Rovo/bot comments`);

    const recentComments = filteredComments.slice(-5).map((c: any) => {
      const commentText = extractCommentText(c);
      return {
        id: c.id,
        author: c.author?.displayName || c.author?.name || "Unknown",
        body: commentText,
        created: new Date(c.created).toLocaleDateString(),
        createdRaw: c.created,
        updated: c.updated ? new Date(c.updated).toLocaleDateString() : null,
      };
    });

    console.log(`Extracted ${recentComments.length} recent human comments`);

    // Get recent status changes from changelog (last 3)
    const changelog = data.changelog?.histories || [];
    const statusChanges = changelog
      .filter((h: any) => h.items?.some((i: any) => i.field === "status"))
      .slice(-3)
      .map((h: any) => {
        const statusItem = h.items.find((i: any) => i.field === "status");
        return {
          from: statusItem?.fromString,
          to: statusItem?.toString,
          date: new Date(h.created).toLocaleDateString(),
          author: h.author?.displayName || "Unknown",
        };
      });

    // Get assignee changes
    const assigneeChanges = changelog
      .filter((h: any) => h.items?.some((i: any) => i.field === "assignee"))
      .slice(-2)
      .map((h: any) => {
        const assigneeItem = h.items.find((i: any) => i.field === "assignee");
        return {
          from: assigneeItem?.fromString || "Unassigned",
          to: assigneeItem?.toString || "Unassigned",
          date: new Date(h.created).toLocaleDateString(),
        };
      });

    // Extract description
    let description = '';
    if (data.fields?.description) {
      if (data.fields.description.content) {
        // ADF format
        const extractFromNode = (node: any): string => {
          let text = '';
          if (node.type === 'text' && node.text) {
            text += node.text + ' ';
          }
          if (node.content && Array.isArray(node.content)) {
            for (const child of node.content) {
              text += extractFromNode(child);
            }
          }
          return text;
        };
        
        for (const node of data.fields.description.content) {
          description += extractFromNode(node);
        }
      } else if (typeof data.fields.description === 'string') {
        // Plain text
        description = data.fields.description;
      }
    }

    return {
      comments: recentComments.reverse(), // Most recent first
      statusChanges,
      assigneeChanges,
      description: description.trim(),
    };
  } catch (error) {
    console.error("Error fetching ticket history:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticket } = body;

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket data is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = AI_PROVIDER === "groq"
      ? process.env.GROQ_API_KEY
      : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: `${AI_PROVIDER.toUpperCase()} API key not configured. Please set ${AI_PROVIDER === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"} environment variable.`,
        },
        { status: 500 }
      );
    }

    const client = getAIClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Invalid AI provider configured" },
        { status: 500 }
      );
    }

    // Fetch ticket history and comments
    console.log(`Fetching history for ticket: ${ticket.key}`);
    const history = await fetchTicketHistory(ticket.key);

    // Build context with HEAVY emphasis on comments
    let context = `TICKET BASICS:
Key: ${ticket.key}
Summary: ${ticket.summary}
Current Status: ${ticket.status}
Assignee: ${ticket.assignee}
Priority: ${ticket.wlMainTicketType || 'N/A'} / ${ticket.wlSubTicketType || 'N/A'}
Customer Level: ${ticket.customerLevel || 'N/A'}
Created: ${new Date(ticket.created).toLocaleDateString()}
Due Date: ${ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : 'N/A'}`;

    // Track if we have recent activity
    let hasRecentActivity = false;

    // Add history information if available
    console.log("🚀 ~ POST ~ history:", history);
    
    if (history) {
      // PRIORITY 1: Recent Comments (MOST IMPORTANT)
      if (history.comments && history.comments.length > 0) {
        hasRecentActivity = true;
        context += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RECENT COMMENTS (MOST IMPORTANT - READ THESE FIRST):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        history.comments.forEach((comment: any, index: number) => {
          const isLatest = index === 0;
          const marker = isLatest ? '🔥 [LATEST COMMENT]' : `[Comment ${history.comments.length - index}]`;
          const commentText = typeof comment.body === 'string'
            ? comment.body
            : String(comment.body || '');
          
          // Use more text for the latest comment
          const maxLength = isLatest ? 800 : 400;
          const truncated = commentText.length > maxLength;
          const displayText = truncated 
            ? commentText.slice(0, maxLength) + '...'
            : commentText;
          
          context += `\n\n${marker}
Date: ${comment.created}
Author: ${comment.author}
Content: ${displayText}`;
        });
      }

      // PRIORITY 2: Status Changes
      if (history.statusChanges && history.statusChanges.length > 0) {
        hasRecentActivity = true;
        context += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RECENT STATUS CHANGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        history.statusChanges.forEach((change: any) => {
          context += `\n- ${change.date}: ${change.from} → ${change.to} (by ${change.author})`;
        });
      }

      // PRIORITY 3: Assignee Changes
      if (history.assigneeChanges && history.assigneeChanges.length > 0) {
        context += `\n\n👤 RECENT ASSIGNEE CHANGES:`;
        history.assigneeChanges.forEach((change: any) => {
          context += `\n- ${change.date}: ${change.from} → ${change.to}`;
        });
      }

      // PRIORITY 4: Original Description (least important)
      if (history.description) {
        context += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 ORIGINAL DESCRIPTION (for background only):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${history.description.slice(0, 300)}${history.description.length > 300 ? '...' : ''}`;
      }
    }

    if (!hasRecentActivity) {
      context += `\n\n⚠️ NOTE: No recent comments or status changes found. Base analysis on ticket basics and description.`;
    }

    context = context.trim();

    // Enhanced prompt that emphasizes comments
    const prompt = `You are an AI assistant creating handover notes for a support team. Your PRIMARY job is to analyze the MOST RECENT COMMENT to understand what's happening NOW.

${context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR TASK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate two statements for the handover:

1️⃣ STATUS (What's happening RIGHT NOW):
   
   🎯 YOUR PRIORITY ORDER:
   1. If there's a LATEST COMMENT (marked with 🔥), extract the current situation from it
   2. If no recent comment, use the latest status change
   3. If nothing recent, infer from ticket status and description
   
   ❌ DO NOT say:
   - "Ticket is in WL - Processing status"
   - "Currently being worked on"
   - "Awaiting review"
   
   ✅ DO say things like:
   - "Customer reported database timeout error yesterday, logs collected"
   - "Engineering team identified memory leak in auth service"
   - "Waiting for customer to confirm if issue persists after cache clear"
   - "Fix deployed to production on Nov 14, monitoring for 48 hours"
   - "Customer hasn't responded to follow-up email sent Nov 10"
   
   📏 LIMIT: 20 words maximum

2️⃣ ACTION (What needs to happen NEXT):
   
   🎯 Be ULTRA SPECIFIC:
   - WHO needs to do it
   - WHAT exactly they need to do
   - WHEN if time-sensitive
   
   ❌ DO NOT say:
   - "Follow up on ticket"
   - "Continue monitoring"
   - "Check status"
   
   ✅ DO say things like:
   - "Sarah to call customer by EOD Monday to discuss migration timeline"
   - "Escalate to database team if timeout occurs again"
   - "Close ticket after customer confirms no issues for 72 hours"
   - "Schedule demo call with customer for new feature walkthrough"
   - "Send follow-up email to customer requesting error logs"
   
   📏 LIMIT: 20 words maximum

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 The LATEST COMMENT is your MOST IMPORTANT source - it shows what's happening NOW
🔴 Extract concrete details from comments (names, dates, specific issues, actions taken)
🔴 Be specific, not generic
🔴 Focus on actionable information
🔴 Use natural, professional language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Respond with ONLY this JSON (no markdown, no backticks):
{
  "status": "your status here",
  "action": "your action here"
}`;

    console.log(`Calling ${AI_PROVIDER.toUpperCase()} API for ticket:`, ticket.key);

    // Select model based on provider
    const model = AI_PROVIDER === "groq"
      ? "llama-3.3-70b-versatile"
      : "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a precise assistant specialized in analyzing support ticket comments to create handover notes. You ALWAYS prioritize the most recent comment over everything else. You extract specific details like names, dates, issues, and actions. You respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more focused, consistent output
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const suggestion = completion.choices[0]?.message?.content;

    if (!suggestion) {
      throw new Error("No response from AI provider");
    }

    let parsed;
    try {
      parsed = JSON.parse(suggestion);
    } catch (parseError) {
      console.error("Failed to parse AI response:", suggestion);
      throw new Error("Invalid JSON response from AI");
    }

    // Validate and sanitize response
    const status = (parsed.status?.trim() || "Pending review - check ticket details").slice(0, 200);
    const action = (parsed.action?.trim() || "Review ticket and determine next steps").slice(0, 200);

    // Log word counts for monitoring
    const statusWords = status.split(/\s+/).length;
    const actionWords = action.split(/\s+/).length;
    
    console.log(`AI suggestion for ${ticket.key}:`, {
      status: `${status} (${statusWords} words)`,
      action: `${action} (${actionWords} words)`,
      hasComments: history?.comments?.length || 0,
    });

    return NextResponse.json({
      success: true,
      suggestion: {
        status,
        action,
      },
      debug: {
        hasComments: history?.comments?.length || 0,
        hasStatusChanges: history?.statusChanges?.length || 0,
        wordCounts: { status: statusWords, action: actionWords },
      },
    });
  } catch (error: any) {
    console.error("Error generating AI suggestion:", error);

    // Check if it's an API error
    if (error.status === 401) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid ${AI_PROVIDER.toUpperCase()} API key. Please check your ${AI_PROVIDER === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"} environment variable.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate suggestion",
        suggestion: {
          status: "Error generating status - please review ticket manually",
          action: "Manually review ticket history and add handover notes",
        },
      },
      { status: 500 }
    );
  }
}