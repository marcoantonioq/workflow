import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  // 1. Captura o código da UORG pela URL e os dados pelo corpo da requisição
  const uorg_code = getRouterParam(event, "id");
  const body = await readBody(event);

  // 2. Validação de Segurança (Opcional, mas recomendado)
  // Verifica se o usuário que está tentando editar pertence a este setor
  const userDept = getHeader(event, "x-user-department");
  if (userDept && userDept !== uorg_code) {
    throw createError({
      statusCode: 403,
      statusMessage: "Você não tem permissão para editar o FAQ deste departamento.",
    });
  }

  try {
    // 3. Atualização Atômica no Prisma
    // O Prisma sobrescreve o campo JSON com o novo array enviado pelo frontend
    const updatedDepartment = await prisma.department.update({
      where: { uorg_code },
      data: {
        faq: body.faq, // O corpo deve conter { faq: [...] }
      },
      select: {
        faq: true, // Retorna apenas o campo atualizado para confirmar
      }
    });

    return {
      success: true,
      faq: updatedDepartment.faq,
    };
  } catch (error) {
    console.error("Erro ao atualizar FAQ:", error);
    
    throw createError({
      statusCode: 500,
      statusMessage: "Erro interno ao salvar os dados do FAQ.",
    });
  }
});