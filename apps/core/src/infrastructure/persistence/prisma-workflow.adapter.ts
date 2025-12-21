import { Inject, Injectable, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Workflow } from 'src/domain/entities/workflow.entity';
import { randomUUID } from 'node:crypto';
import { Workflow as PersistedWorkflow } from '$prisma/client';
import { WorkflowRepository } from 'src/domain/repositories/workflow.repository';

const fromPrismaToDomain = (prisma: PersistedWorkflow): Workflow => ({
  id: prisma.id,
  name: prisma.name,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
  executions: [],
  isActive: prisma.isActive,
});

@Injectable()
export class PrismaWorkflowAdapter implements WorkflowRepository {
  constructor(
    @Inject()
    private readonly prismaService: PrismaService,
  ) { }

  async getAll(): Promise<Workflow[]> {
    const prisma = await this.prismaService.workflow.findMany();
    return prisma.map(fromPrismaToDomain);
  }

  async create(
    workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executions'>,
  ): Promise<Workflow> {
    const prisma = await this.prismaService.workflow.create({
      data: {
        ...workflow,
        id: randomUUID(),
      },
    });
    return fromPrismaToDomain(prisma);
  }


}

export const WorkflowRepositoryToken = Symbol('WorkflowRepository');
export const WorkflowRepositoryProvider: Provider = {
  provide: WorkflowRepositoryToken,
  useClass: PrismaWorkflowAdapter,
};
