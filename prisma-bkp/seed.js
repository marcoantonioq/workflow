const { Client } = require('pg');
const { from: copyFrom } = require('pg-copy-streams');
const axios = require('axios');

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function importFromUrl(url, table, columns) {
  console.log(`⏳ Importando ${table}...`);
  
  const stream = client.query(
    copyFrom(`COPY ${table} (${columns}) FROM STDIN WITH CSV HEADER`)
  );

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(stream);
    stream.on('finish', () => {
      console.log(`✅ ${table} finalizado.`);
      resolve();
    });
    stream.on('error', reject);
  });
}

async function run() {
  await client.connect();
  try {
    // 1. Setores (departments)
    await importFromUrl(
      'https://setores.csv',
      'departments',
      'id, uorg_code, initials, name, email'
    );

    // 2. Cargos (positions)
    await importFromUrl(
      'https://cargos.csv',
      'positions',
      'id, name, occupied_positions, summary'
    );

    // 3. Servidores (users)
    await importFromUrl(
      'https://servidores.csv',
      'users',
      'id, full_name, email, department_id, position_id, workstation'
    );

    console.log('🚀 Base de dados completa!');
  } catch (err) {
    console.error('❌ Erro crítico:', err);
  } finally {
    await client.end();
  }
}

run();