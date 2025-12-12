import { z } from "zod";
import { router, protectedMutation } from "@/server/trpc/server";
import fs from "fs";
import path from "path";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const JIRA_URL = process.env.JIRA_URL;
const STORAGE_FILE = path.join(process.cwd(), "ticket_data.json");

export const slackRouter = router({
  send: protectedMutation
    .input(
      z.object({
        ticketData: z.record(z.string(), z.string()),
        ticketDetails: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(input.ticketData, null, 2));

      if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
        throw new Error("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL");
      }

      const ticketKeys = Object.keys(input.ticketData)
        .filter((key) => key.startsWith("status-"))
        .map((key) => key.replace("status-", ""));

      let message = "Please refer to this ticket information\n\n";

      ticketKeys.forEach((ticketKey, index) => {
        const status = input.ticketData[`status-${ticketKey}`] || "--";
        const action = input.ticketData[`action-${ticketKey}`] || "--";
        const details = input.ticketDetails?.[ticketKey] || {};
        const summary = details.summary || "";
        const wlMainType = details.wlMainTicketType || "--";
        const wlSubType = details.wlSubTicketType || "--";
        const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`;

        message += `--- Ticket ${index + 1} ---\n`;
        message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${summary}\n`;
        message += `WL Main Type: ${wlMainType}\n`;
        message += `WL Sub Type: ${wlSubType}\n`;
        message += `Status: ${status}\n`;
        message += `Action: ${action}\n`;
        message += `\n`;
      });
      message += `===========================\n`;

      const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
        },
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          text: message.trim(),
          unfurl_links: false,
          unfurl_media: false,
        }),
      });

      const postResult = await postResponse.json();

      if (!postResult.ok) {
        throw new Error(postResult.error || "Failed to post to Slack");
      }

      return { success: true, message_ts: postResult.ts };
    }),

  postThread: protectedMutation
    .input(
      z.object({
        channelId: z.string(),
        threadTs: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});
