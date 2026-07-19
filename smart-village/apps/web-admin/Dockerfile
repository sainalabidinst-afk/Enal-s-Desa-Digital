FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web-admin/package*.json ./apps/web-admin/

RUN npm ci

COPY apps/web-admin ./apps/web-admin/

WORKDIR /app/apps/web-admin

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web-admin/node_modules ./node_modules
COPY --from=builder /app/apps/web-admin/.next ./.next
COPY --from=builder /app/apps/web-admin/public ./public
COPY --from=builder /app/apps/web-admin/package.json ./package.json
COPY --from=builder /app/apps/web-admin/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "run", "start"]