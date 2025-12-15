import { FeedbackType, FeedbackStatus } from '~/enums'
import { FeedbackRepository, type Feedback } from '~/server/repository/feedback.repository'

const DEFAULT_LIMIT = 100

export interface FeedbackItem {
  id: number
  type: FeedbackType
  title: string
  description: string
  created_at: string
  status: FeedbackStatus
}

export class FeedbackService {
  private repository: FeedbackRepository

  constructor() {
    this.repository = new FeedbackRepository()
  }

  async getAll(limit: number = DEFAULT_LIMIT): Promise<Feedback[]> {
    return this.repository.findAll(limit)
  }

  async getAllItems(limit: number = DEFAULT_LIMIT): Promise<FeedbackItem[]> {
    const feedbacks = await this.repository.findAll(limit)
    return feedbacks.map((f) => this.toItem(f))
  }

  async getById(id: number): Promise<Feedback | null> {
    return this.repository.findById(id)
  }

  async create(type: FeedbackType, title: string, description: string): Promise<Feedback> {
    if (title.length > 200) {
      throw new Error('Title too long (max 200 characters)')
    }
    if (description.length > 2000) {
      throw new Error('Description too long (max 2000 characters)')
    }

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    return this.repository.insert(type, trimmedTitle, trimmedDescription, FeedbackStatus.NEW)
  }

  async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | null> {
    return this.repository.updateStatus(id, status)
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id)
  }

  toItem(feedback: Feedback): FeedbackItem {
    return {
      id: feedback.id,
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      created_at: feedback.created_at instanceof Date
        ? feedback.created_at.toISOString()
        : String(feedback.created_at),
      status: feedback.status,
    }
  }
}
