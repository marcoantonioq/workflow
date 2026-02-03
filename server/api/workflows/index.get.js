import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, "user_id");

    if (!userId) {
      console.error("ERRO: Cookie user_id não encontrado na requisição.");
      return []; // Retorna vazio em vez de erro 500 para não quebrar o front
    }

    const workflows = await prisma.workflow.findMany({
      where: { user_id: userId },
      orderBy: { sort_order: 'asc' },
      include: { 
        // department: {
        //   select: { uorg_code: true }
        // } 
      }
    });

    return workflows;
  } catch (error) {
    console.error("ERRO DETALHADO NO GET WORKFLOWS:", error);
    
    // Fallback: Tenta buscar sem o include caso sua relação no Prisma esteja errada
    try {
      return await prisma.workflow.findMany({
        where: { user_id: getCookie(event, "user_id") }
      });
    } catch (criticalError) {
      throw createError({
        statusCode: 500,
        message: "Erro crítico no banco de dados. Verifique os logs do servidor."
      });
    }
  }
});