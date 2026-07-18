import { Module, Global } from '@nestjs/common';
import { SearchService } from './search.service';
import { PostgresSearchProvider } from './providers/postgres-search.provider';

@Global()
@Module({
  providers: [
    SearchService,
    {
      provide: 'SearchProvider',
      useClass: PostgresSearchProvider,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}