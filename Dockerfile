FROM node:20-alpine AS base

WORKDIR /app
RUN apk add --no-cache postgresql-client
COPY package*.json ./

# Estágio de Dependências
FROM base AS deps
RUN npm install

# Estágio de Build (Produção)
FROM deps AS builder
COPY . .
RUN npx prisma generate
RUN npm run build

# Estágio Final (Produção)
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules 

USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]