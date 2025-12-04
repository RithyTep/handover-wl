import { BackupRepository } from "@/server/repository/backup.repository";
import type { Backup, BackupItem } from "@/interfaces/backup.interface";
import { BackupType } from "@/enums/backup.enum";

export class BackupService {
  private repository: BackupRepository;

  constructor() {
    this.repository = new BackupRepository();
  }

  async getAll(limit?: number): Promise<Backup[]> {
    return this.repository.getAll(limit);
  }

  async getById(id: number): Promise<Backup | null> {
    return this.repository.getById(id);
  }

  async create(backupType: BackupType, description?: string): Promise<Backup> {
    return this.repository.create(backupType, description);
  }

  async restore(backupId: number): Promise<boolean> {
    return this.repository.restore(backupId);
  }

  async cleanupOld(keepCount?: number): Promise<number> {
    return this.repository.cleanupOld(keepCount);
  }

  transformToItem(backup: Backup): BackupItem {
    return this.repository.transformToItem(backup);
  }
}
