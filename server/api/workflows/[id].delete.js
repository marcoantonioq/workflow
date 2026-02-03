// server/api/workflows/[id].delete.js
import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id");
  const id = getRouterParam(event, 'id');

  if (!userId) throw createError({ statusCode: 401, message: "Não autorizado" });

  try {
    // Garantimos que o usuário só apague fluxos que pertencem a ele
    await prisma.workflow.delete({
      where: { 
        id: id,
        user_id: userId 
      }
    });

    return { success: true };
  } catch (error) {
    throw createError({ 
      statusCode: 500, 
      message: "Erro ao excluir o fluxo ou registro não encontrado." 
    });
  }
});