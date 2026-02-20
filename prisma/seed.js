import { PrismaClient, Prisma } from '@prisma/client';
import { readFile, readdir, rename } from 'fs/promises';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();
const DATA_DIR = join(process.cwd(), 'prisma', 'data');
const PREFIX = 'imported_';

/**
 * Converte valores baseado nos metadados reais do Prisma
 */
const castValue = (val, field) => {
  if ([null, undefined, '', 'NULL'].includes(val)) return null;

  switch (field.type) {
    case 'Boolean':  return String(val).toLowerCase().trim() === 'true';
    case 'Int':      return parseInt(val, 10);
    case 'Float':
    case 'Decimal':  return parseFloat(val);
    case 'DateTime': 
      const iso = String(val).replace(' ', 'T');
      return new Date(iso).toISOString();
    case 'Json':
      try { return JSON.parse(val); } catch { return val; }
    default:         return String(val);
  }
};

async function processFile(file, modelName, dmmf) {
  const filePath = join(DATA_DIR, file);
  const rows = parse(await readFile(filePath, 'utf-8'), {
    columns: true, skip_empty_lines: true, trim: true, bom: true
  });

  // Obtém metadados do modelo específico
  const modelMeta = dmmf.datamodel.models.find(m => m.name === modelName);
  const fieldMap = modelMeta.fields.reduce((acc, f) => ({ ...acc, [f.name]: f }), {});
  
  let successCount = 0;
  let hasError = false;

  console.log(`⏳ [${file}] -> Sincronizando ${modelName}...`);

  for (const row of rows) {
    const firstCol = Object.keys(row)[0];
    const idValue = String(row.id || row[firstCol]).trim();
    const data = {};

    Object.entries(row).forEach(([col, val]) => {
      if (fieldMap[col]) data[col] = castValue(val, fieldMap[col]);
    });

    try {
      const modelClient = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
      await modelClient.upsert({
        where: { [row.id ? 'id' : firstCol]: idValue },
        update: data,
        create: data,
      });
      successCount++;
    } catch (err) {
      console.error(`  ❌ Erro no ID ${idValue}: ${err.message}`);
      hasError = true;
    }
  }

  if (!hasError) {
    await rename(filePath, join(DATA_DIR, `${PREFIX}${file}`));
    console.log(`  ✅ Concluído: ${successCount} registros.`);
  }
}

async function main() {
  try {
    await prisma.$connect();
    
    // Acessa o DMMF de forma segura
    const dmmf = Prisma.dmmf;
    const files = await readdir(DATA_DIR);
    const prismaModels = dmmf.datamodel.models.map(m => m.name);

    const pending = files
      .filter(f => f.endsWith('.csv') && !f.startsWith(PREFIX))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (!pending.length) return console.log('ℹ️ Sem novos arquivos para processar.');

    for (const file of pending) {
      const slug = file.replace(/^\d+\./, '').replace('.csv', '').toLowerCase();
      // Busca o modelo ignorando case e plural
      const model = prismaModels.find(m => {
        const mLow = m.toLowerCase();
        return mLow === slug || `${mLow}s` === slug;
      });

      if (model) {
        await processFile(file, model, dmmf);
      } else {
        console.warn(`⚠️ Arquivo ${file} não mapeado para modelos: ${prismaModels.join(', ')}`);
      }
    }
  } catch (err) {
    console.error('❌ Erro Crítico:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();