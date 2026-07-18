#!/bin/bash
# ============================================================
# Smart Village Backup Script
# Usage: ./scripts/backup.sh [postgres|minio|redis|all]
# ============================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# PostgreSQL Backup
backup_postgres() {
    log "Starting PostgreSQL backup..."
    local db_url="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/smart_village}"
    
    mkdir -p "${BACKUP_DIR}/postgres"
    
    # Extract connection info from DATABASE_URL
    local filename="smart_village_${TIMESTAMP}.sql.gz"
    
    pg_dump "${db_url}" | gzip > "${BACKUP_DIR}/postgres/${filename}"
    
    if [ $? -eq 0 ]; then
        log "✅ PostgreSQL backup completed: ${filename}"
        log "   Size: $(du -h "${BACKUP_DIR}/postgres/${filename}" | cut -f1)"
    else
        error "❌ PostgreSQL backup failed!"
        exit 1
    fi
}

# MinIO Backup
backup_minio() {
    log "Starting MinIO backup..."
    local endpoint="${MINIO_ENDPOINT:-localhost}:${MINIO_PORT:-9000}"
    local access_key="${MINIO_ACCESS_KEY:-minioadmin}"
    local secret_key="${MINIO_SECRET_KEY:-minioadmin}"
    local bucket="${MINIO_BUCKET:-smart-village}"
    
    mkdir -p "${BACKUP_DIR}/minio"
    
    # Check if mc is installed
    if ! command -v mc &> /dev/null; then
        warn "MinIO client (mc) not found. Installing..."
        curl -s https://dl.min.io/client/mc/release/linux-amd64/mc -o /tmp/mc
        chmod +x /tmp/mc
        /tmp/mc alias set local "http://${endpoint}" "${access_key}" "${secret_key}"
    else
        mc alias set local "http://${endpoint}" "${access_key}" "${secret_key}" 2>/dev/null
    fi
    
    local backup_file="${BACKUP_DIR}/minio/${bucket}_${TIMESTAMP}.tar.gz"
    
    # Mirror bucket to local directory and compress
    mc mirror local/${bucket} "/tmp/minio_backup_${TIMESTAMP}"
    tar -czf "${backup_file}" -C "/tmp" "minio_backup_${TIMESTAMP}"
    rm -rf "/tmp/minio_backup_${TIMESTAMP}"
    
    if [ $? -eq 0 ]; then
        log "✅ MinIO backup completed: $(basename ${backup_file})"
        log "   Size: $(du -h "${backup_file}" | cut -f1)"
    else
        error "❌ MinIO backup failed!"
        exit 1
    fi
}

# Redis Backup
backup_redis() {
    log "Starting Redis backup..."
    local redis_url="${REDIS_URL:-redis://localhost:6379}"
    
    mkdir -p "${BACKUP_DIR}/redis"
    
    # Trigger Redis SAVE
    redis-cli -u "${redis_url}" SAVE
    
    # Get the dump file location
    local dump_dir=$(redis-cli -u "${redis_url}" CONFIG GET dir | tail -1)
    local dump_file="${dump_dir}/dump.rdb"
    
    if [ -f "${dump_file}" ]; then
        cp "${dump_file}" "${BACKUP_DIR}/redis/dump_${TIMESTAMP}.rdb"
        log "✅ Redis backup completed: dump_${TIMESTAMP}.rdb"
        log "   Size: $(du -h "${BACKUP_DIR}/redis/dump_${TIMESTAMP}.rdb" | cut -f1)"
    else
        error "❌ Redis dump file not found at ${dump_file}"
        exit 1
    fi
}

# Restore PostgreSQL
restore_postgres() {
    local backup_file="$1"
    if [ ! -f "${backup_file}" ]; then
        error "Backup file not found: ${backup_file}"
        exit 1
    fi
    
    log "Restoring PostgreSQL from ${backup_file}..."
    local db_url="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/smart_village}"
    
    gunzip -c "${backup_file}" | psql "${db_url}"
    log "✅ PostgreSQL restore completed!"
}

# Restore MinIO
restore_minio() {
    local backup_file="$1"
    if [ ! -f "${backup_file}" ]; then
        error "Backup file not found: ${backup_file}"
        exit 1
    fi
    
    log "Restoring MinIO from ${backup_file}..."
    local endpoint="${MINIO_ENDPOINT:-localhost}:${MINIO_PORT:-9000}"
    local access_key="${MINIO_ACCESS_KEY:-minioadmin}"
    local secret_key="${MINIO_SECRET_KEY:-minioadmin}"
    local bucket="${MINIO_BUCKET:-smart-village}"
    
    local restore_dir="/tmp/minio_restore_${TIMESTAMP}"
    mkdir -p "${restore_dir}"
    tar -xzf "${backup_file}" -C "${restore_dir}"
    
    mc alias set local "http://${endpoint}" "${access_key}" "${secret_key}" 2>/dev/null
    mc mirror "${restore_dir}" local/${bucket}
    rm -rf "${restore_dir}"
    
    log "✅ MinIO restore completed!"
}

# Cleanup old backups
cleanup() {
    log "Cleaning up backups older than ${RETENTION_DAYS} days..."
    
    find "${BACKUP_DIR}/postgres" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    find "${BACKUP_DIR}/minio" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    find "${BACKUP_DIR}/redis" -name "*.rdb" -mtime +${RETENTION_DAYS} -delete
    
    log "✅ Cleanup completed!"
}

# List backups
list_backups() {
    echo "=== PostgreSQL Backups ==="
    ls -lh "${BACKUP_DIR}/postgres/" 2>/dev/null || echo "  (none)"
    echo ""
    echo "=== MinIO Backups ==="
    ls -lh "${BACKUP_DIR}/minio/" 2>/dev/null || echo "  (none)"
    echo ""
    echo "=== Redis Backups ==="
    ls -lh "${BACKUP_DIR}/redis/" 2>/dev/null || echo "  (none)"
}

# Main
mkdir -p "${BACKUP_DIR}"

case "${1:-all}" in
    postgres)
        backup_postgres
        ;;
    minio)
        backup_minio
        ;;
    redis)
        backup_redis
        ;;
    all)
        backup_postgres
        backup_minio
        backup_redis
        cleanup
        log "🎉 All backups completed successfully!"
        ;;
    restore)
        case "$2" in
            postgres) restore_postgres "$3" ;;
            minio) restore_minio "$3" ;;
            *) error "Usage: $0 restore [postgres|minio] <backup_file>" ;;
        esac
        ;;
    list)
        list_backups
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 [postgres|minio|redis|all|restore|list|cleanup]"
        echo ""
        echo "Examples:"
        echo "  $0 all                    # Backup everything"
        echo "  $0 postgres              # Backup PostgreSQL only"
        echo "  $0 restore postgres file.sql.gz  # Restore PostgreSQL"
        echo "  $0 list                  # List all backups"
        echo "  $0 cleanup               # Cleanup old backups"
        exit 1
        ;;
esac