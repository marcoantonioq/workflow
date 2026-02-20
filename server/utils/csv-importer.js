import { PrismaClient, Prisma } from '@prisma/client';
import { readFile, readdir, rename } from 'fs/promises';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();
const DATA_DIR = join(process.cwd(), 'prisma', 'data');
const PREFIX = 'imported_';

const TypeHandlers = {
  Boolean: (val) => String(val).toLowerCase().trim() === 'true',
  Int: (val) => parseInt(val, 10),
  Number: (val) => parseFloat(val),
  DateTime: (val) => new Date(String(val).replace(' ', 'T')).toISOString(),
  Json: (val) => { try { return JSON.parse(val); } catch { return val; } },
  String: (val) => String(val)
};

export async function runImport() {
  const dmmf = Prisma.dmmf;
  const files = await readdir(DATA_DIR);
  const models = dmmf.datamodel.models;
  const results = [];

  const pendingFiles = files
    .filter(f => f.endsWith('.csv') && !f.startsWith(PREFIX))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const file of pendingFiles) {
    const slug = file.replace(/^\d+\./, '').replace('.csv', '').toLowerCase();
    const modelMeta = models.find(m => [m.name.toLowerCase(), `${m.name.toLowerCase()}s`].includes(slug));
    
    if (modelMeta) {
      const res = await processFile(file, modelMeta);
      results.push(res);
    }
  }
  return results;
}

async function processFile(file, modelMeta) {
  const filePath = join(DATA_DIR, file);
  const content = await readFile(filePath, 'utf-8');
  const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true, bom: true });
  const fieldMap = modelMeta.fields.reduce((acc, f) => ({ ...acc, [f.name]: f }), {});
  const modelName = modelMeta.name;
  const modelClient = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)];

  let errors = 0;
  for (const row of rows) {
    const data = {};
    Object.entries(row).forEach(([col, val]) => {
      if (fieldMap[col]) data[col] = castValue(val, fieldMap[col]);
    });
    const idKey = row.id ? 'id' : Object.keys(row)[0];
    try {
      await modelClient.upsert({ where: { [idKey]: String(row[idKey]).trim() }, update: data, create: data });
    } catch { errors++; }
  }

  if (errors === 0) await rename(filePath, join(DATA_DIR, `${PREFIX}${file}`));
  return { file, success: rows.length - errors, errors };
}

const castValue = (val, field) => {
  if ([null, undefined, '', 'NULL'].includes(val)) return null;
  const handler = TypeHandlers[field.type] || TypeHandlers[['Float', 'Decimal'].includes(field.type) ? 'Number' : 'String'];
  return handler(val);
};
