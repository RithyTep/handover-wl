import { ScheduledCommentRepository } from "@/server/repository/scheduled-comment.repository";
import type { ScheduledComment } from "@/interfaces/scheduled-comment.interface";
import { CommentType } from "@/enums/comment.enum";

export class ScheduledCommentService {
  private repository: ScheduledCommentRepository;

  constructor() {
    this.repository = new ScheduledCommentRepository();
  }

  async getAll(): Promise<ScheduledComment[]> {
    return this.repository.getAll();
  }

  async getEnabled(): Promise<ScheduledComment[]> {
    return this.repository.getEnabled();
  }

  async create(
    commentType: CommentType,
    commentText: string,
    cronSchedule: string,
    enabled: boolean,
    ticketKey?: string
  ): Promise<ScheduledComment> {
    return this.repository.create(commentType, commentText, cronSchedule, enabled, ticketKey);
  }

  async update(
    id: number,
    commentType: CommentType,
    commentText: string,
    cronSchedule: string,
    enabled: boolean,
    ticketKey?: string
  ): Promise<ScheduledComment | null> {
    return this.repository.update(id, commentType, commentText, cronSchedule, enabled, ticketKey);
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async updateLastPosted(id: number): Promise<void> {
    await this.repository.updateLastPosted(id);
  }
}
