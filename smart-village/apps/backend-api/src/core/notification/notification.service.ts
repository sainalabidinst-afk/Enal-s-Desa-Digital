import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';

export interface SendNotificationOptions {
  userId: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, any>;
  channels?: ('IN_APP' | 'EMAIL' | 'PUSH' | 'WHATSAPP')[];
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {}

  async send(options: SendNotificationOptions): Promise<void> {
    const channels = options.channels || ['IN_APP'];

    // Always save in-app notification
    if (channels.includes('IN_APP')) {
      await this.saveInApp(options);
    }

    // Queue other channels for async processing
    if (channels.includes('EMAIL')) {
      await this.queueService.add('send.email', {
        userId: options.userId,
        subject: options.title,
        body: options.body,
        data: options.data,
      });
    }

    if (channels.includes('PUSH')) {
      await this.queueService.add('send.push', {
        userId: options.userId,
        title: options.title,
        body: options.body,
        data: options.data,
      });
    }

    if (channels.includes('WHATSAPP')) {
      await this.queueService.add('send.whatsapp', {
        userId: options.userId,
        message: options.body,
        data: options.data,
      });
    }

    this.logger.debug(`Notification sent to ${options.userId} via ${channels.join(', ')}`);
  }

  async sendToRole(roleSlug: string, options: Omit<SendNotificationOptions, 'userId'>): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        role: { slug: roleSlug },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    for (const user of users) {
      await this.send({ ...options, userId: user.id });
    }
  }

  async sendToVillage(villageId: string, options: Omit<SendNotificationOptions, 'userId'>): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        villageId,
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    for (const user of users) {
      await this.send({ ...options, userId: user.id });
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false, deletedAt: null },
    });
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId, deletedAt: null },
      }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private async saveInApp(options: SendNotificationOptions): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId: options.userId,
        title: options.title,
        body: options.body,
        type: options.type || 'INFO',
        channel: 'IN_APP',
        data: options.data || undefined,
      },
    });
  }
}