// Prisma 7: a URL de conexão não fica mais no `schema.prisma`.
// O Prisma (Migrate) vai buscar daqui (e o valor vem do seu `.env`).
export default {
  schema: "server/prisma/schema.prisma",
  migrate: {
    datasourceUrl: process.env.DATABASE_URL,
  },
};

