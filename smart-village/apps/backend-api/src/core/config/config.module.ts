import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from './config.schema';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, any>) => {
        const result = configSchema.safeParse(config);
        if (!result.success) {
          console.error('❌ Invalid configuration:');
          result.error.errors.forEach((e) =>
            console.error(`  - ${e.path.join('.')}: ${e.message}`),
          );
          process.exit(1);
        }
        return result.data;
      },
    }),
  ],
  exports: [ConfigService],
})
export class SmartConfigModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    console.log(`🚀 Application starting in ${nodeEnv} mode`);
    console.log(`📡 API: http://localhost:${this.configService.get('PORT')}/${this.configService.get('API_PREFIX')}`);
  }
}