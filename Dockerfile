FROM node:20-alpine AS base
RUN apk add --no-cache postgresql-client

# Estágio de Dependências
FROM base AS deps
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN chown -R node:node /app
RUN npm install

# Estágio de Build (Produção)
FROM deps AS builder
COPY . .
RUN npx prisma generate
RUN npm run build

# Estágio Final (Produção)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/package.json /app/package.json
RUN npm install --only=production
USER root
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]