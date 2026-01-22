import { Inject, Injectable, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WorkflowSchema } from 'src/domain/entities/workflow-schema.entity';
import { WorkflowSchema as PersistedWorkflowSchema } from '$prisma/client';
import { randomUUID } from 'node:crypto';
import { WorkflowSchemaRepository } from 'src/domain/repositories/workflow-schema.repository';

export const fromPrismaToDomain = (
  prisma: PersistedWorkflowSchema,
): WorkflowSchema => ({
  id: prisma.id,
  schema: prisma.schema,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
  workflowId: prisma.workflowId,
  isActive: prisma.isActive,
});

@Injectable()
export class PrismaWorkflowSchemaAdapter implements WorkflowSchemaRepository {
  constructor(
    @Inject()
    private readonly prismaService: PrismaService,
  ) {}

  async get(id: string): Promise<WorkflowSchema> {
    const prisma = await this.prismaService.workflowSchema.findUniqueOrThrow({
      where: { id },
    });
    return fromPrismaToDomain(prisma);
  }

  async update(
    id: string,
    data: Partial<Omit<WorkflowSchema, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<WorkflowSchema> {
    const prisma = await this.prismaService.workflowSchema.update({
      where: { id },
      data,
    });
    return fromPrismaToDomain(prisma);
  }

  async create(
    data: Omit<WorkflowSchema, 'id' | 'createdAt'>,
  ): Promise<WorkflowSchema> {
    const prisma = await this.prismaService.workflowSchema.create({
      data: {
        ...data,
        schema: data.schema,
        id: randomUUID(),
      },
    });
    return fromPrismaToDomain(prisma);
  }

  async getByActiveWorkflowId(workflowId: string): Promise<WorkflowSchema> {
    const prisma = await this.prismaService.workflowSchema.findFirstOrThrow({
      where: {
        workflow: {
          id: workflowId,
        },
      },
    });
    return fromPrismaToDomain(prisma);
  }
}

export const WorkflowSchemaRepositoryToken = Symbol('WorkflowSchemaRepository');
export const WorkflowSchemaRepositoryProvider: Provider = {
  provide: WorkflowSchemaRepositoryToken,
  useClass: PrismaWorkflowSchemaAdapter,
};
