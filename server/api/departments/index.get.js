import prisma from "@@/lib/db";

/**
 * Normaliza o texto removendo acentos no Node.js
 */
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = String(query.search || "").trim();

  try {
    let whereClause = {};

    if (search) {
      // 1. Preparamos o termo de busca limpo
      const term = `%${normalizeText(search)}%`;

      // 2. SQL Raw para buscar os IDs (uorg_code) ignorando acentos
      // unaccent() remove acentos da coluna e do termo
      // lower() garante a insensibilidade a maiúsculas
      const results = await prisma.$queryRaw`
        SELECT DISTINCT d.uorg_code 
        FROM "departments" d
        LEFT JOIN "users" u ON u.department_id = d.uorg_code
        LEFT JOIN "workflows" w ON w.department_id = d.uorg_code
        WHERE 
          unaccent(lower(d.name)) LIKE unaccent(lower(${term})) OR
          unaccent(lower(d.initials)) LIKE unaccent(lower(${term})) OR
          unaccent(lower(d.responsibilities)) LIKE unaccent(lower(${term})) OR
          unaccent(lower(u.full_name)) LIKE unaccent(lower(${term})) OR
          unaccent(lower(w.title)) LIKE unaccent(lower(${term})) OR
          unaccent(lower(w.description)) LIKE unaccent(lower(${term}))
      `;

      // Se não houver matches no SQL, retornamos vazio
      if (!results || results.length === 0) return [];

      const codes = results.map((r) => r.uorg_code);
      whereClause = { uorg_code: { in: codes } };
    }

    // 3. Busca final utilizando a API fluente do Prisma
    return await prisma.department.findMany({
      where: whereClause,
      include: {
        members: {
          include: { position: true },
        },
        workflows: {
          select: {
            id: true,
            title: true,
            description: true,
            objectives: true,
          },
        },
        _count: {
          select: { members: true, workflows: true },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Erro na busca:", error);

    // Tratamento amigável para erro de falta da extensão unaccent
    const message = error.message?.includes("unaccent")
      ? "Erro: Extensão 'unaccent' não instalada no PostgreSQL."
      : "Erro interno ao buscar departamentos.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
