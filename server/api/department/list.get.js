// server/api/departments/codes.get.ts (exemplo de caminho)
import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const departments = await prisma.department.findMany({
    select: {
      uorg_code: true
    },
    orderBy: {
      uorg_code: 'asc'
    }
  })
  return departments.map(d => d.uorg_code)
})