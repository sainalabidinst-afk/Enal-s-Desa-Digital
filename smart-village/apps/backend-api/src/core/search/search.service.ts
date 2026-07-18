import { Inject, Injectable, Logger } from '@nestjs/common';
import { SearchProvider, SearchOptions, SearchResult } from './interfaces/search-provider.interface';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject('SearchProvider')
    private readonly provider: SearchProvider,
  ) {}

  async index(indexName: string, id: string, document: Record<string, any>): Promise<void> {
    this.logger.debug(`Indexing ${indexName}/${id}`);
    await this.provider.index(indexName, id, document);
  }

  async bulkIndex(indexName: string, documents: { id: string; document: Record<string, any> }[]): Promise<void> {
    this.logger.debug(`Bulk indexing ${documents.length} documents in ${indexName}`);
    await this.provider.bulkIndex(indexName, documents);
  }

  async search(indexName: string, query: string, options?: SearchOptions): Promise<SearchResult[]> {
    this.logger.debug(`Searching ${indexName} for: ${query}`);
    return this.provider.search(indexName, query, options);
  }

  async deleteIndex(indexName: string, id: string): Promise<void> {
    this.logger.debug(`Deleting ${indexName}/${id}`);
    await this.provider.deleteIndex(indexName, id);
  }

  async deleteByQuery(indexName: string, field: string, value: string): Promise<void> {
    this.logger.debug(`Deleting from ${indexName} where ${field}=${value}`);
    await this.provider.deleteByQuery(indexName, field, value);
  }
}