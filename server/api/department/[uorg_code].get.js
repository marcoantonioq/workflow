import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const uorg_code = getRouterParam(event, "uorg_code");

  const department = await prisma.department.findUnique({
    where: { uorg_code },
    include: {
      members: {
        include: {
          position: true,
        },
        where: {
          is_active: true,
        },
        orderBy: {
          full_name: "asc",
        },
      },
    },
  });

  if (!department) {
    throw createError({
      statusCode: 404,
      statusMessage: "Setor não encontrado",
    });
  }

  const relatedWorkflows = await prisma.workflow.findMany({
    where: {
      OR: [
        { department_id: uorg_code },
        {
          structure: {
            path: ['etapas', 'tarefas', 'setores'],
            array_contains: uorg_code,
          },
        },
      ],
    },
  });

  return {
    ...department,
    relatedWorkflows,
  };
});
