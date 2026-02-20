import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const uorg_code = getRouterParam(event, "id");
  const { url } = await readBody(event); // Usamos a URL como identificador único para remoção

  const department = await prisma.department.findUnique({
    where: { uorg_code },
    select: { documents: true }
  });

  const currentDocs = Array.isArray(department.documents) ? department.documents : [];
  
  // Filtra o array removendo o documento com a URL correspondente
  const filteredDocs = currentDocs.filter(doc => doc.url !== url);

  await prisma.department.update({
    where: { uorg_code },
    data: {
      documents: filteredDocs
    }
  });

  return { success: true, removed: true };
});