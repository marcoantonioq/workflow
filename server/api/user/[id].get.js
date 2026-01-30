import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = await prisma.user.findUnique({
    // Se no seu schema a matrícula for outro campo, mude 'id' para o nome do campo
    where: { id: id }, 
    include: {
      department: true,
      position: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Matrícula não encontrada no sistema.',
    })
  }

  return user
})