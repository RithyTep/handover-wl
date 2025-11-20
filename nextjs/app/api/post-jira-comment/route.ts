import { NextRequest, NextResponse } from "next/server";
import { updateLastPostedAt } from "@/lib/db";

// POST - Post a comment to a Jira ticket using user token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticket_key, comment_text, scheduled_comment_id } = body;

    if (!ticket_key || !comment_text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: ticket_key, comment_text" },
        { status: 400 }
      );
    }

    // Get Jira credentials from environment variables (user token, not bot)
    const jiraUrl = process.env.JIRA_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraToken = process.env.JIRA_API_TOKEN;

    if (!jiraUrl || !jiraEmail || !jiraToken) {
      console.error("Missing Jira configuration");
      return NextResponse.json(
        { success: false, error: "Missing Jira configuration" },
        { status: 500 }
      );
    }

    // Create Basic Auth header using user's token
    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64");

    // Post comment to Jira using Atlassian Document Format (ADF)
    const commentBody = {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: comment_text,
              },
            ],
          },
        ],
      },
    };

    const response = await fetch(
      `${jiraUrl}/rest/api/3/issue/${ticket_key}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to post comment to ${ticket_key}:`, errorText);
      return NextResponse.json(
        { success: false, error: `Failed to post comment to Jira: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Successfully posted comment to ${ticket_key}`);

    // Update last_posted_at if this is from a scheduled comment
    if (scheduled_comment_id) {
      await updateLastPostedAt(scheduled_comment_id);
    }

    return NextResponse.json({
      success: true,
      comment: data,
      message: `Comment posted to ${ticket_key}`,
    });
  } catch (error) {
    console.error("Error posting comment to Jira:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post comment to Jira" },
      { status: 500 }
    );
  }
}
