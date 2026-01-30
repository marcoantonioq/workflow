import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  try {
    return await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Erro ao buscar setores' });
  }
});