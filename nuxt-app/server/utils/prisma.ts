import { PrismaClient } from '~/lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { getDatabaseConfig, isProduction } from './env'

interface GlobalForPrisma {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

const globalForPrisma = globalThis as unknown as GlobalForPrisma

function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pool ?? new Pool(getDatabaseConfig())
  const adapter = new PrismaPg(pool)

  if (!isProduction()) {
    globalForPrisma.pool = pool
  }

  return new PrismaClient({
    adapter,
    log: isProduction() ? ['error'] : ['query', 'error', 'warn'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (!isProduction()) {
  globalForPrisma.prisma = prisma
}

export type { PrismaClient }
