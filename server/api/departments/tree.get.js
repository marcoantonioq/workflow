// server/api/departments/tree.get.js
import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  return await prisma.department.findMany({
    where: {
      parent_code: null // Busca apenas os "nós raiz" (departamentos principais)
    },
    include: {
      children: {
        include: {
          children: true // Traz até o 3º nível; para mais níveis, recomenda-se recursão no código
        }
      }
    }
  });
});