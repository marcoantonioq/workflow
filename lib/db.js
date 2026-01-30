// db.js

import { PrismaClient } from '@prisma/client';

// Garante instancia única (singleton) do PrismaClient
const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma._prisma) {
  globalForPrisma._prisma = new PrismaClient();
}

prisma = globalForPrisma._prisma;

export default prisma;