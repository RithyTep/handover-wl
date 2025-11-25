import { TIMEOUTS, TIMEZONE } from "@/lib/config";
import type { SlackBlock, SlackResponse } from "@/lib/types";

const SLACK_API = "https://slack.com/api";
const { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } = process.env;

async function callApi(
  endpoint: string,
  body: Record<string, any>,
  token: string = SLACK_BOT_TOKEN!
): Promise<SlackResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.SLACK);

  try {
    const response = await fetch(`${SLACK_API}/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: error.name === "AbortError" ? "Request timeout" : error.message,
    };
  }
}

export async function postMessage(
  text: string,
  channel: string = SLACK_CHANNEL_ID!,
  blocks?: SlackBlock[],
  token?: string
): Promise<SlackResponse> {
  return callApi("chat.postMessage", { channel, text, ...(blocks && { blocks }) }, token);
}

export async function postThreadReply(
  text: string,
  threadTs: string,
  channel: string = SLACK_CHANNEL_ID!,
  token?: string
): Promise<SlackResponse> {
  return callApi("chat.postMessage", { channel, text, thread_ts: threadTs }, token);
}

export async function updateMessage(
  text: string,
  ts: string,
  channel: string = SLACK_CHANNEL_ID!,
  blocks?: SlackBlock[]
): Promise<SlackResponse> {
  return callApi("chat.update", { channel, ts, text, ...(blocks && { blocks }) });
}

export async function getHistory(
  channel: string = SLACK_CHANNEL_ID!,
  limit: number = 100
): Promise<SlackResponse> {
  return callApi("conversations.history", { channel, limit });
}

export async function getThreadReplies(
  threadTs: string,
  channel: string = SLACK_CHANNEL_ID!
): Promise<SlackResponse> {
  return callApi("conversations.replies", { channel, ts: threadTs });
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE.NAME,
  });
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE.NAME,
  });
}
