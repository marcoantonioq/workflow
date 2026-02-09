import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID do membro é obrigatório",
    });
  }

  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      position: true,
      department: true,
    },
  });

  if (!member) {
    throw createError({
      statusCode: 404,
      statusMessage: "Membro não encontrado",
    });
  }

  return member;
});
