import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id");
  if (!userId) throw createError({ statusCode: 401, message: "Não autorizado" });

  const body = await readBody(event);
  const workflowsRaw = Array.isArray(body.workflows) ? body.workflows : [];

  try {
    // 2. Transação para garantir que tudo seja salvo ou nada seja salvo em caso de erro
    return await prisma.$transaction(async (tx) => {
      const operations = workflowsRaw.map(async (fluxo, index) => {
        const workflowData = {
          title: fluxo.identificacao,
          description: fluxo.descricao || "",
          objectives: fluxo.objetivos || "",
          documents: fluxo.documentos || "",
          sort_order: index,
          user_id: userId,
          department_id: fluxo.department_id,
          structure: {
            etapas: fluxo.etapas || [],
            isExpanded: fluxo.isExpanded ?? true
          }
        };

        // UPSERT: Atualiza se o ID existir, senão cria
        return tx.workflow.upsert({
          where: { id: fluxo.id },
          update: workflowData,
          create: { id: fluxo.id, ...workflowData }
        });
      });

      const results = await Promise.all(operations);
      return { success: true, count: results.filter(r => r !== null).length };
    });
  } catch (error) {
    console.error("Erro Prisma:", error);
    throw createError({ statusCode: 500, message: error.message });
  }
});