#!/bin/bash

# Configurações
BASE_URL="http://10.11.0.205:9300"
TARGET_DIR="prisma/data"

# Lista de arquivos para baixar
FILES=(
    "1.department.csv"
    "2.position.csv"
    "3.user.csv"
    "4.workflow.csv"
)

echo "--- Iniciando o download dos arquivos para $TARGET_DIR ---"

# Cria o diretório caso não exista
mkdir -p "$TARGET_DIR"

# Entra no diretório
cd "$TARGET_DIR" || { echo "Erro ao acessar o diretório $TARGET_DIR"; exit 1; }

# Loop para baixar cada arquivo
for FILE in "${FILES[@]}"; do
    echo "Baixando $FILE..."
    
    # -q: quiet (limpa a saída)
    # -N: apenas baixa se o arquivo no servidor for mais novo ou não existir localmente
    wget -q -N "$BASE_URL/$FILE"
    
    if [ $? -eq 0 ]; then
        echo "✓ $FILE baixado com sucesso."
    else
        echo "✗ Erro ao baixar $FILE."
    fi
done

echo "--- Processo concluído ---"