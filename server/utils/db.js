import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  // Para SQLite, não precisamos de 'pg' ou adaptadores externos no Node.js
  // O Prisma já gerencia a conexão via DATABASE_URL no schema.prisma
  return new PrismaClient()
}

// Singleton para evitar múltiplas conexões em desenvolvimento (Hot Reload)
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}