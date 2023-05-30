import { PrismaClient } from '@prisma/client';

// New PrismaClient for its own file to prevent multiple db calls
export const prisma = new PrismaClient();
