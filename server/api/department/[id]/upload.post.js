import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  const uorg_code = getRouterParam(event, "id");
  const body = await readBody(event);

  // 1. Busca o departamento atual para pegar os documentos existentes
  const department = await prisma.department.findUnique({
    where: { uorg_code },
    select: { documents: true }
  });

  if (!department) throw createError({ statusCode: 404, message: "Setor não encontrado" });

  // 2. Garante que temos um array
  const currentDocs = Array.isArray(department.documents) ? department.documents : [];

  // 3. Cria o novo objeto de documento
  const newDoc = {
    title: body.title || "Sem título",
    url: body.url,
    description: body.description || "",
    added_at: new Date().toISOString()
  };

  // 4. Atualiza o banco dando um spread no array antigo + novo
  const updated = await prisma.department.update({
    where: { uorg_code },
    data: {
      documents: [newDoc, ...currentDocs]
    }
  });

  return { success: true, document: newDoc };
});