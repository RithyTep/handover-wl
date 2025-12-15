import { CommentType } from '~/enums'
import {
  ScheduledCommentRepository,
  type InsertCommentOptions,
  type UpdateCommentOptions,
} from '../repository/scheduled-comment.repository'
import type { ScheduledComment } from '~/types/scheduled-comment'

export interface ScheduledCommentItem {
  id: number
  comment_type: CommentType
  ticket_key: string | null
  comment_text: string
  cron_schedule: string
  enabled: boolean
  created_at: string
  updated_at: string
  last_posted_at: string | null
}

export interface CreateCommentOptions {
  commentType: CommentType
  commentText: string
  cronSchedule: string
  enabled: boolean
  ticketKey?: string
}

export interface UpdateCommentServiceOptions extends CreateCommentOptions {
  id: number
}

export class ScheduledCommentService {
  private repository: ScheduledCommentRepository

  constructor() {
    this.repository = new ScheduledCommentRepository()
  }

  async getAll(): Promise<ScheduledComment[]> {
    return this.repository.findAll()
  }

  async getAllItems(): Promise<ScheduledCommentItem[]> {
    const comments = await this.repository.findAll()
    return comments.map((c) => this.toItem(c))
  }

  async getEnabled(): Promise<ScheduledComment[]> {
    return this.repository.findEnabled()
  }

  async getById(id: number): Promise<ScheduledComment | null> {
    return this.repository.findById(id)
  }

  async create(options: CreateCommentOptions): Promise<ScheduledComment> {
    const insertOptions: InsertCommentOptions = {
      commentType: options.commentType,
      commentText: options.commentText,
      cronSchedule: options.cronSchedule,
      enabled: options.enabled,
      ticketKey: options.ticketKey ?? null,
    }
    return this.repository.insert(insertOptions)
  }

  async update(options: UpdateCommentServiceOptions): Promise<ScheduledComment | null> {
    const updateOptions: UpdateCommentOptions = {
      id: options.id,
      commentType: options.commentType,
      commentText: options.commentText,
      cronSchedule: options.cronSchedule,
      enabled: options.enabled,
      ticketKey: options.ticketKey ?? null,
    }
    return this.repository.update(updateOptions)
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id)
  }

  async updateLastPosted(id: number): Promise<void> {
    await this.repository.updateLastPosted(id)
  }

  private toItem(comment: ScheduledComment): ScheduledCommentItem {
    const toDateString = (value: Date | string | undefined | null): string | null => {
      if (!value) return null
      if (typeof value === 'string') return value
      return value.toISOString()
    }

    return {
      id: comment.id,
      comment_type: comment.comment_type,
      ticket_key: comment.ticket_key ?? null,
      comment_text: comment.comment_text,
      cron_schedule: comment.cron_schedule,
      enabled: comment.enabled,
      created_at: toDateString(comment.created_at) ?? new Date().toISOString(),
      updated_at: toDateString(comment.updated_at) ?? new Date().toISOString(),
      last_posted_at: toDateString(comment.last_posted_at),
    }
  }
}
