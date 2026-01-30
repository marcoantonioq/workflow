import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const readCsv = async (file) => {
  const path = join(process.cwd(), 'prisma', file);
  const content = await readFile(path, 'utf-8');
  return parse(content, { 
    columns: true, 
    skip_empty_lines: true, 
    trim: true, 
    bom: true 
  });
};

async function main() {
  try {
    console.log('⏳ Importando setores...');
    const setoresRows = await readCsv('setores.csv');
    const siglasValidas = new Set();

    for (const row of setoresRows) {
      const sigla = row['Setor Sigla'];
      if (!sigla) continue;

      // Mapeamento explícito das colunas do CSV para o Prisma
      const sectorData = {
        name: row['Setor'],
        email: row['E-mail'] || null,
        // CARREGANDO A COLUNA DE COMPETÊNCIAS AQUI:
        competencies: row['Responsabilidades e Competências do Setor'] || null,
        initials: sigla,
      };

      await prisma.department.upsert({
        where: { uorg_code: sigla },
        update: sectorData,
        create: { 
          uorg_code: sigla,
          ...sectorData 
        },
      });
      siglasValidas.add(sigla);
    }
    console.log(`✅ ${siglasValidas.size} setores atualizados (competências inclusas).`);

    console.log('⏳ Importando servidores e cargos...');
    const servidoresRows = await readCsv('servidores.csv');
    let sucessos = 0;

    for (const row of servidoresRows) {
      const id = row['Matrícula'];
      const nome = row['Nome'];
      const nomeCargo = row['Cargo'];
      const siglaSetor = row['Setor Sigla'];

      if (!id || !nome) continue;

      // Tratamento manual para Position (evitando erro de constraint Unique)
      let positionId = null;
      if (nomeCargo) {
        let cargoDb = await prisma.position.findFirst({ where: { name: nomeCargo } });
        if (!cargoDb) {
          cargoDb = await prisma.position.create({ data: { name: nomeCargo } });
        }
        positionId = cargoDb.id;
      }

      const userData = {
        full_name: nome,
        email: row['E-mail para Contato'] || null,
        workstation: row['Funções'] || null,
        department: siglasValidas.has(siglaSetor) 
          ? { connect: { uorg_code: siglaSetor } } 
          : undefined,
        position: positionId 
          ? { connect: { id: positionId } } 
          : undefined,
      };

      await prisma.user.upsert({
        where: { id },
        update: userData,
        create: { id, ...userData },
      });
      
      sucessos++;
    }

    console.log(`✅ ${sucessos} servidores processados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro durante a execução do seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();