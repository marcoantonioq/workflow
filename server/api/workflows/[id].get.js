import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  // 1. Obtém o ID dos parâmetros da URL
  const id = getRouterParam(event, "id");

  try {
    // 2. Busca o workflow no banco de dados
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        // Inclui o autor para mostrar nome/foto na lateral
        author: {
          select: {
            id: true,
            full_name: true,
            photo_url: true,
          }
        },
        // Inclui o departamento para mostrar nome e siglas no cabeçalho
        department: {
          select: {
            name: true,
            initials: true,
            uorg_code: true
          }
        }
      }
    });

    // 3. Validação de existência
    if (!workflow) {
      throw createError({
        statusCode: 404,
        statusMessage: "Fluxo de trabalho não encontrado.",
      });
    }

    // 4. Retorna os dados (Prisma já converte os campos JSON automaticamente)
    return workflow;

  } catch (error) {
    console.error("Erro ao buscar Workflow:", error);
    
    throw createError({
      statusCode: 500,
      statusMessage: "Erro interno ao processar a requisição.",
    });
  }
});