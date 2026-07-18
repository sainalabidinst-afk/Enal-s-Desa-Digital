import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchProvider, SearchOptions, SearchResult } from '../interfaces/search-provider.interface';

@Injectable()
export class PostgresSearchProvider implements SearchProvider {
  private readonly logger = new Logger(PostgresSearchProvider.name);

  constructor(private readonly prisma: PrismaService) {}

  async index(indexName: string, id: string, document: Record<string, any>): Promise<void> {
    // Using PostgreSQL tsvector for full-text search
    const searchText = Object.values(document)
      .filter((v) => typeof v === 'string')
      .join(' ');

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO search_index (id, index_name, document, search_vector)
       VALUES ($1, $2, $3::jsonb, to_tsvector('indonesian', $4))
       ON CONFLICT (id, index_name)
       DO UPDATE SET document = $3::jsonb, search_vector = to_tsvector('indonesian', $4), updated_at = NOW()`,
      id,
      indexName,
      JSON.stringify(document),
      searchText,
    );
  }

  async bulkIndex(indexName: string, documents: { id: string; document: Record<string, any> }[]): Promise<void> {
    for (const doc of documents) {
      await this.index(indexName, doc.id, doc.document);
    }
    this.logger.debug(`Bulk indexed ${documents.length} documents in ${indexName}`);
  }

  async search(indexName: string, query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const results = await this.prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT id, index_name, document, ts_rank(search_vector, plainto_tsquery('indonesian', $1)) AS score
       FROM search_index
       WHERE index_name = $2
         AND search_vector @@ plainto_tsquery('indonesian', $1)
         AND deleted_at IS NULL
       ORDER BY score DESC
       LIMIT $3 OFFSET $4`,
      query,
      indexName,
      limit,
      offset,
    );

    return results.map((r: any) => ({
      id: r.id,
      indexName: r.index_name,
      score: r.score || 0,
      document: r.document,
    }));
  }

  async deleteIndex(indexName: string, id: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE search_index SET deleted_at = NOW() WHERE id = $1 AND index_name = $2`,
      id,
      indexName,
    );
  }

  async deleteByQuery(indexName: string, field: string, value: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE search_index SET deleted_at = NOW() WHERE index_name = $1 AND document->>$2 = $3`,
      indexName,
      field,
      value,
    );
  }
}