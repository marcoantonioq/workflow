import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          position: true 
        },
        where: {
          is_active: true
        },
        orderBy: {
          full_name: 'asc' 
        }
      }
    }
  })

  if (!department) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Setor não encontrado' 
    })
  }

  return department
})