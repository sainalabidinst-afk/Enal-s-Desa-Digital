import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface WorkflowAction {
  instanceId: string;
  action: 'APPROVE' | 'REJECT' | 'FORWARD';
  userId: string;
  userName: string;
  userRole: string;
  notes?: string;
}

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(private readonly prisma: PrismaService) {}

  async startWorkflow(workflowCode: string, resourceId: string): Promise<string> {
    const definition = await this.prisma.workflowDefinition.findUnique({
      where: { code: workflowCode },
      include: { stages: { orderBy: { sequence: 'asc' } } },
    });

    if (!definition) {
      throw new NotFoundException(`Workflow definition not found: ${workflowCode}`);
    }

    if (!definition.isActive) {
      throw new BadRequestException(`Workflow is inactive: ${workflowCode}`);
    }

    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowId: definition.id,
        resourceId,
        currentStage: 1,
        status: 'IN_PROGRESS',
      },
    });

    this.logger.log(`Workflow started: ${workflowCode} -> ${instance.id}`);
    return instance.id;
  }

  async processAction(input: WorkflowAction): Promise<void> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: input.instanceId },
      include: {
        workflow: {
          include: { stages: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Workflow instance not found');
    }

    if (instance.status !== 'IN_PROGRESS') {
      throw new BadRequestException(`Workflow is already ${instance.status}`);
    }

    const currentStage = instance.workflow.stages.find(
      (s) => s.sequence === instance.currentStage,
    );

    if (!currentStage) {
      throw new BadRequestException('Invalid workflow stage');
    }

    // Record history
    await this.prisma.workflowHistory.create({
      data: {
        instanceId: instance.id,
        stageSeq: currentStage.sequence,
        action: input.action,
        notes: input.notes,
        userId: input.userId,
        userName: input.userName,
        userRole: input.userRole,
      },
    });

    if (input.action === 'REJECT') {
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: { status: 'REJECTED' },
      });
      this.logger.log(`Workflow ${instance.id} rejected at stage ${currentStage.sequence}`);
      return;
    }

    if (input.action === 'APPROVE') {
      if (currentStage.isFinal) {
        await this.prisma.workflowInstance.update({
          where: { id: instance.id },
          data: { status: 'APPROVED' },
        });
        this.logger.log(`Workflow ${instance.id} fully approved`);
        return;
      }

      // Move to next stage
      const nextStage = instance.currentStage + 1;
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: { currentStage: nextStage },
      });
      this.logger.log(`Workflow ${instance.id} moved to stage ${nextStage}`);
    }

    if (input.action === 'FORWARD') {
      // Manual forward to specified stage
      const maxStage = Math.max(...instance.workflow.stages.map((s) => s.sequence));
      const nextStage = Math.min(instance.currentStage + 1, maxStage);
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: { currentStage: nextStage },
      });
    }
  }

  async getWorkflowStatus(instanceId: string): Promise<any> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: {
          include: { stages: { orderBy: { sequence: 'asc' } } },
        },
        history: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!instance) {
      throw new NotFoundException('Workflow instance not found');
    }

    const currentStage = instance.workflow.stages.find(
      (s) => s.sequence === instance.currentStage,
    );

    return {
      id: instance.id,
      workflowCode: instance.workflow.code,
      workflowName: instance.workflow.name,
      resourceId: instance.resourceId,
      status: instance.status,
      currentStage: currentStage
        ? {
            sequence: currentStage.sequence,
            name: currentStage.name,
            isFinal: currentStage.isFinal,
          }
        : null,
      history: instance.history,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    };
  }

  async getPendingApprovals(roleSlug: string, villageId: string): Promise<any[]> {
    // Find workflow instances that need approval from this role
    const instances = await this.prisma.workflowInstance.findMany({
      where: {
        status: 'IN_PROGRESS',
        workflow: {
          isActive: true,
          stages: {
            some: {
              roleSlug,
              isFinal: false,
            },
          },
        },
      },
      include: {
        workflow: {
          select: { code: true, name: true },
        },
        history: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return instances;
  }
}