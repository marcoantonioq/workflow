import { createPostgresJsAdapter } from '@prisma/adapter-postgres';
import { PrismaClient } from '@prisma/client';
import postgres from 'postgres';

export const definePrismaClient = (databaseUrl) => {
  const client = postgres(databaseUrl);
  const adapter = createPostgresJsAdapter(client);
  return new PrismaClient({ adapter });
};
