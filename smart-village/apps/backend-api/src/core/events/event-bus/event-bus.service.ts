import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { QueueService } from '../../queue/queue.service';

export interface IEvent {
  name: string;
  timestamp: Date;
  data: any;
}

export interface IEventHandler {
  handle(event: IEvent): Promise<void>;
}

@Injectable()
export class EventBus {
  private readonly logger = new Logger(EventBus.name);
  private handlers = new Map<string, string[]>(); // eventName -> handlerClassNames

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly queueService: QueueService,
  ) {}

  register(eventName: string, handlerClassName: string): void {
    const existing = this.handlers.get(eventName) || [];
    existing.push(handlerClassName);
    this.handlers.set(eventName, existing);
    this.logger.debug(`Registered handler ${handlerClassName} for event ${eventName}`);
  }

  async publish(event: IEvent): Promise<void> {
    const handlerNames = this.handlers.get(event.name) || [];
    
    if (handlerNames.length === 0) {
      this.logger.warn(`No handlers registered for event: ${event.name}`);
      return;
    }

    this.logger.debug(`Publishing event ${event.name} to ${handlerNames.length} handler(s)`);

    // Dispatch to queue for async processing
    for (const handlerName of handlerNames) {
      await this.queueService.add(
        `event.${event.name}`,
        {
          event,
          handlerName,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      );
    }
  }

  async processEvent(event: IEvent, handlerClassName: string): Promise<void> {
    try {
      const handler = this.moduleRef.get<IEventHandler>(handlerClassName, { strict: false });
      if (handler) {
        await handler.handle(event);
      } else {
        this.logger.error(`Handler ${handlerClassName} not found`);
      }
    } catch (error) {
      this.logger.error(`Error processing event ${event.name} by ${handlerClassName}: ${error.message}`);
      throw error;
    }
  }
}