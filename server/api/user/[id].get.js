import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      position: true,
      department: true
    }
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado' })
  }

  return user
})