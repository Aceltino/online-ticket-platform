import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// 1. create pg pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. instantiate the adapter
const adapter = new PrismaPg(pool);

// 3. create prisma client with adapter
export const prisma = new PrismaClient({ adapter });
