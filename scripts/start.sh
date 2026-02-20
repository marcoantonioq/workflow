#!/bin/bash
set -e

DB_USER=${DB_USER:-admin}
DB_NAME=${DB_NAME:-workflow}
DB_PASS=${DB_PASS:-admin123}

echo "Waiting for PostgreSQL database to be ready at ${DB_SERVER}:${DB_PORT:-5432}..."
# Usa psql para verificar a disponibilidade do banco de dados
# O loop 'until' garante que a aplicação não tentará se conectar antes que o DB esteja pronto.
until PGPASSWORD="${DB_PASS}" psql -h "${DB_SERVER}" -p "${DB_PORT:-5432}" -U "${DB_USER}" -d "${DB_NAME}" -c '\q'; do
  echo "PostgreSQL está indisponível - aguardando..."
  sleep 1
done
echo "PostgreSQL está disponível e rodando!"

# Executa o Prisma generate e as migrações
echo "Executando Prisma generate e migrações..."
npm run db:generate # Gera o cliente Prisma baseado no schema
npm run db:migrate  # Aplica as migrações pendentes

# Condicionalmente executa o seed se houver novos arquivos CSV
# DATA_DIR="./prisma/data" # Caminho relativo dentro do container
# if [ -d "$DATA_DIR" ] && find "$DATA_DIR" -maxdepth 1 -type f -name "*.csv" ! -name "imported_*.csv" | grep -q .; then
#   echo "Executando seed do banco de dados do Prisma..."
#   npm run db:seed
# else
#   echo "Nenhum novo arquivo CSV para seed encontrado ou diretório de dados ausente."
# fi

# Inicia a aplicação Nuxt
echo "Iniciando aplicação Nuxt em modo ${NODE_ENV}..."
# Em um ambiente de container com uma imagem já construída,
# sempre iniciamos o servidor de produção do Nuxt.
# A variável NODE_ENV influenciará o comportamento interno da aplicação, não o comando de inicialização aqui.
exec node .output/server/index.mjs
