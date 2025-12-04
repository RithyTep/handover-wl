import { withClient } from "./database.repository";
import type { Feedback } from "@/interfaces/feedback.interface";
import { FeedbackType } from "@/enums/feedback.enum";
import { FeedbackStatus } from "@/enums/feedback.enum";

export class FeedbackRepository {
  async getAll(limit: number = 100): Promise<Feedback[]> {
    return withClient(async (client) => {
      const result = await client.query(
        `SELECT id, type, title, description, created_at, status
         FROM feedback
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    }, []);
  }

  async create(type: FeedbackType, title: string, description: string): Promise<Feedback> {
    return withClient(async (client) => {
      const result = await client.query(
        `INSERT INTO feedback (type, title, description, created_at, status)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
         RETURNING id, type, title, description, created_at, status`,
        [type, title.trim(), description.trim(), FeedbackStatus.NEW]
      );
      return result.rows[0];
    }, null as unknown as Feedback);
  }
}
