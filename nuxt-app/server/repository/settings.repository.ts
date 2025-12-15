import { prisma } from '../utils/prisma'
import type { AppSetting } from '~/lib/generated/prisma'

export class SettingsRepository {
  async findByKey(key: string): Promise<string | null> {
    const setting = await prisma.appSetting.findUnique({
      where: { key },
    })
    return setting?.value ?? null
  }

  async findByKeys(keys: string[]): Promise<AppSetting[]> {
    return prisma.appSetting.findMany({
      where: { key: { in: keys } },
    })
  }

  async findAll(): Promise<AppSetting[]> {
    return prisma.appSetting.findMany()
  }

  async upsert(key: string, value: string): Promise<AppSetting> {
    return prisma.appSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    })
  }

  async upsertMany(settings: Record<string, string>): Promise<void> {
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { key, value },
        })
      )
    )
  }

  async delete(key: string): Promise<boolean> {
    try {
      await prisma.appSetting.delete({
        where: { key },
      })
      return true
    } catch {
      return false
    }
  }
}
