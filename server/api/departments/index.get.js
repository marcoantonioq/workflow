import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = query.search || "";

  return await prisma.department.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { initials: { contains: search, mode: 'insensitive' } },
        { responsibilities: { contains: search, mode: 'insensitive' } },
        { members: { some: { full_name: { contains: search, mode: 'insensitive' } } } },
        { workflows: { some: { title: { contains: search, mode: 'insensitive' } } } },
        { workflows: { some: { description: { contains: search, mode: 'insensitive' } } } }
      ]
    },
    include: {
      members: {
        include: {
          position: true
        }
      },
      workflows: {
        select: {
          id: true,
          title: true,
          description: true,
          objectives: true
        }
      },
      _count: {
        select: { members: true, workflows: true }
      }
    },
    orderBy: { name: 'asc' }
  });
});