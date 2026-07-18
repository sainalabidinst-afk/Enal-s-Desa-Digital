export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  indexName: string;
  score: number;
  document: Record<string, any>;
}

export interface SearchProvider {
  index(indexName: string, id: string, document: Record<string, any>): Promise<void>;
  bulkIndex(indexName: string, documents: { id: string; document: Record<string, any> }[]): Promise<void>;
  search(indexName: string, query: string, options?: SearchOptions): Promise<SearchResult[]>;
  deleteIndex(indexName: string, id: string): Promise<void>;
  deleteByQuery(indexName: string, field: string, value: string): Promise<void>;
}