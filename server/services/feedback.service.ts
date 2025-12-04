import { FeedbackRepository } from "@/server/repository/feedback.repository";
import type { Feedback } from "@/interfaces/feedback.interface";
import { FeedbackType } from "@/enums/feedback.enum";

export class FeedbackService {
  private repository: FeedbackRepository;

  constructor() {
    this.repository = new FeedbackRepository();
  }

  async getAll(limit?: number): Promise<Feedback[]> {
    return this.repository.getAll(limit);
  }

  async create(type: FeedbackType, title: string, description: string): Promise<Feedback> {
    if (title.length > 200) {
      throw new Error("Title too long (max 200 characters)");
    }
    if (description.length > 2000) {
      throw new Error("Description too long (max 2000 characters)");
    }
    return this.repository.create(type, title, description);
  }
}
