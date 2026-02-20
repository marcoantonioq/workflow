import prisma from "@@/lib/db";

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Erro ao aceder à base de dados:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao aceder à base de dados",
      data: error.message,
    });
  }
});
