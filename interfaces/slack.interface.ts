export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: unknown[];
  accessory?: unknown;
  block_id?: string;
}

export interface SlackResponse {
  ok: boolean;
  error?: string;
  ts?: string;
  channel?: string;
  message?: unknown;
  messages?: unknown[];
}
