import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  try {
    const userId = getCookie(event, "user_id");

    if (!userId) {
      console.error("ERRO: Cookie user_id não encontrado na requisição.");
      return []; // Retorna vazio em vez de erro 500 para não quebrar o front
    }

    console.log("Buscando workflows para o user_id:", userId);

    // Busca department_id do usuário para também retornar workflows do mesmo setor
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { department_id: true }
    });

    const departmentId = user?.department_id ?? null;

    const whereClause = departmentId
      ? { OR: [{ user_id: userId }, { department_id: departmentId }] }
      : { user_id: userId };

    // busca inicial por usuário ou departamento
    let workflows = await prisma.workflow.findMany({
      where: whereClause,
      orderBy: { sort_order: 'asc' },
      include: {
        department: {
          select: { uorg_code: true, name: true }
        }
      }
    });

    // Se tivermos departmentId, buscar também workflows cujo JSON 'structure' menciona esse setor
    if (departmentId) {
      try {
        const likePattern = `%"${departmentId}"%`;
        // busca IDs candidatos que contenham o departmentId no JSON (simple text match)
        const structMatches = await prisma.$queryRaw`SELECT id FROM workflows WHERE structure::text LIKE ${likePattern}`;
        const structIds = structMatches.map((r) => r.id).filter(Boolean);

        // remover ids já obtidos
        const existingIds = new Set(workflows.map((w) => w.id));
        const missingIds = structIds.filter((id) => !existingIds.has(id));

        if (missingIds.length > 0) {
          const extra = await prisma.workflow.findMany({
            where: { id: { in: missingIds } },
            orderBy: { sort_order: 'asc' },
            include: {
              department: {
                select: { uorg_code: true, name: true }
              }
            }
          });

          workflows = workflows.concat(extra);
        }
      } catch (jsonErr) {
        // se a busca por JSON falhar, não interrompe a resposta principal
        console.warn('Falha ao buscar workflows pelo JSON structure:', jsonErr);
      }
    }

    return workflows;
  } catch (error) {
    console.error("ERRO DETALHADO NO GET WORKFLOWS:", error);

    // Fallback: Tenta buscar sem o include caso sua relação no Prisma esteja errada
    try {
      const user = await prisma.user.findUnique({
        where: { id: getCookie(event, "user_id") },
        select: { department_id: true }
      });
      const departmentId = user?.department_id ?? null;
      const whereClause = departmentId
        ? { OR: [{ user_id: getCookie(event, "user_id") }, { department_id: departmentId }] }
        : { user_id: getCookie(event, "user_id") };

      let workflows = await prisma.workflow.findMany({
        where: whereClause
      });

      if (departmentId) {
        try {
          const likePattern = `%"${departmentId}"%`;
          const structMatches = await prisma.$queryRaw`SELECT id FROM workflows WHERE structure::text LIKE ${likePattern}`;
          const structIds = structMatches.map((r) => r.id).filter(Boolean);

          const existingIds = new Set(workflows.map((w) => w.id));
          const missingIds = structIds.filter((id) => !existingIds.has(id));

          if (missingIds.length > 0) {
            const extra = await prisma.workflow.findMany({ where: { id: { in: missingIds } } });
            workflows = workflows.concat(extra);
          }
        } catch (jsonErr) {
          console.warn('Falha no fallback ao buscar pelo JSON structure:', jsonErr);
        }
      }

      return workflows;
    } catch (criticalError) {
      throw createError({
        statusCode: 500,
        message: "Erro crítico no banco de dados. Verifique os logs do servidor."
      });
    }
  }
});