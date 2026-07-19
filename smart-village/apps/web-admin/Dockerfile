FROM node:20-alpine AS development

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
COPY apps/web-admin/package*.json ./apps/web-admin/
COPY apps/web-admin ./apps/web-admin/

WORKDIR /app/apps/web-admin

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]