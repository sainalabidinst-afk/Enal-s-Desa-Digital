FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY apps/backend-api/package*.json ./apps/backend-api/
COPY apps/backend-api/prisma ./apps/backend-api/prisma/

RUN npm install

COPY apps/backend-api ./apps/backend-api/

WORKDIR /app/apps/backend-api

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend-api/node_modules ./node_modules
COPY --from=builder /app/apps/backend-api/dist ./dist
COPY --from=builder /app/apps/backend-api/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]