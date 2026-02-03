# 📋 FluxForm – Documentação de Processos

Aplicação web para **levantamento e documentação de processos institucionais**, permitindo o cadastro dinâmico de etapas, riscos e links associados.

O projeto utiliza **Docker e Docker Compose**, garantindo simplicidade na execução e padronização do ambiente.

---

## 🚀 Tecnologias Utilizadas

- HTML
- CSS
- JavaScript
- Docker
- Docker Compose

---

## 📦 Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Docker
- Docker Compose

---

## ▶️ Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone git@github.com:marcoantonioq/workflow.git
cd workflow
```

### 2️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
```

### 3️⃣ Executar o projeto    

```bash
docker compose up -d
```

### 4️⃣ Acessar a aplicação

Acesse `http://localhost:3000` no seu navegador.

### 5️⃣ Parar o projeto

```bash
docker compose down
```

