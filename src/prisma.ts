import { Prisma, PrismaClient, User } from '@prisma/client'
import type { Prisma as PrismaTypes } from '@prisma/client'

let errorFormat: PrismaTypes.ErrorFormat | undefined
let log: (PrismaTypes.LogLevel | PrismaTypes.LogDefinition)[] | undefined

if (process.env.NODE_ENV === 'production') {
  // only log warnings/errors in live environments
  errorFormat = 'colorless'
  log = [
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ]
} else {
  // verbose logging in dev
  errorFormat = 'pretty'
  log = [
    { level: 'query', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ]
}

export type { PrismaTypes }

export { Prisma, PrismaClient, User }

export const prisma = new PrismaClient({
  errorFormat,
  log,
})
