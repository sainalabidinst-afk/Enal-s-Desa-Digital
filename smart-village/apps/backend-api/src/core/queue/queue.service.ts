import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, QueueOptions, WorkerOptions, Job } from 'bullmq';
import { Redis } from 'ioredis';

export interface JobOptions {
  attempts?: number;
  backoff?: { type: 'exponential' | 'fixed'; delay: number };
  delay?: number;
  priority?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: Redis;
  private queues = new Map<string, Queue>();
  private workers: Worker[] = [];

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: this.connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });
      this.queues.set(name, queue);
      this.logger.log(`Queue created: ${name}`);
    }
    return this.queues.get(name)!;
  }

  async add<T>(queueName: string, data: T, options?: JobOptions): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    const job = await queue.add(queueName, data, {
      attempts: options?.attempts || 3,
      backoff: options?.backoff || { type: 'exponential', delay: 2000 },
      delay: options?.delay,
      priority: options?.priority,
      removeOnComplete: options?.removeOnComplete ?? true,
      removeOnFail: options?.removeOnFail ?? false,
    });
    this.logger.debug(`Job added to ${queueName}: ${job.id}`);
    return job;
  }

  registerWorker<T = any>(
    queueName: string,
    processor: (job: Job<T>) => Promise<void>,
    options?: Partial<WorkerOptions>,
  ): Worker {
    const worker = new Worker<T>(
      queueName,
      async (job) => {
        this.logger.debug(`Processing job ${job.id} from ${queueName}`);
        const startTime = Date.now();
        try {
          await processor(job);
          const duration = Date.now() - startTime;
          this.logger.debug(`Job ${job.id} completed in ${duration}ms`);
        } catch (error) {
          this.logger.error(`Job ${job.id} failed: ${error.message}`);
          throw error;
        }
      },
      {
        connection: this.connection,
        concurrency: 5,
        ...options,
      },
    );

    worker.on('completed', (job) => {
      this.logger.log(`✅ Job ${job.id} completed`);
    });

    worker.on('failed', (job, error) => {
      this.logger.error(`❌ Job ${job.id} failed: ${error.message}`);
    });

    this.workers.push(worker);
    this.logger.log(`Worker registered for queue: ${queueName}`);
    return worker;
  }

  async getJobCounts(queueName: string) {
    const queue = this.getQueue(queueName);
    return queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down queue workers...');
    for (const worker of this.workers) {
      await worker.close();
    }
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    await this.connection.quit();
  }
}