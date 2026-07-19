# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Nginx (reverse proxy)
- PM2 (process manager)

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/smart_village
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=refresh-secret-min-32-chars
CORS_ORIGINS=https://desa.yourdomain.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

## Deployment Steps

### 1. PostgreSQL Backup Script
```bash
#!/bin/bash
# backup-db.sh
pg_dump -h localhost -U postgres smart_village > backups/smart_village_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Backend Deploy
```bash
cd apps/backend-api
npm ci --production
npx prisma migrate deploy
npm run build
pm2 start dist/main.js --name smart-village-api
```

### 3. Frontend Deploy
```bash
cd apps/web-admin
npm ci --production
npm run build
pm2 start npm --name smart-village-web -- start
```

### 4. Nginx Config
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name yourdomain.com;
  
  location /api/ {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
  }
}
```

### 5. SSL (Let's Encrypt)
```bash
certbot --nginx -d yourdomain.com
```

## Health Checks

- API: `GET /health/live`
- Frontend: `GET /` returns 200

## Restore Process

```bash
psql -h localhost -U postgres smart_village < backups/smart_village_20260101_000000.sql
```