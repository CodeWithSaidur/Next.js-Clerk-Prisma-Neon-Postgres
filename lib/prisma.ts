'use server';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/app/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter: new PrismaPg(pool) 
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 2