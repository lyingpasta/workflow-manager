import { Injectable, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WorkflowExecutionRepository } from 'src/domain/repositories/workflow-execution.repository';
import {
  ExecutionStatus,
  WorkflowExecution,
} from 'src/domain/entities/workflow-execution.entity';
import { WorkflowExecution as PersistedWorkflowExecution } from '$prisma/client';
import { randomUUID } from 'node:crypto';
import { match, P } from 'ts-pattern';
import { fromPrismaToDomain as fromPrismaToWorkflowSchema } from './prisma-workflow-schema.adapter';

const fromPrismaToDomain = (
  prisma: PersistedWorkflowExecution,
): Omit<WorkflowExecution, 'workflowSchema'> => ({
  id: prisma.id,
  workflowSchemaId: prisma.workflowSchemaId,
  status: match(prisma)
    .with(
      {
        status: P.union(
          'created',
          'started',
          'ongoing',
          'succeeded',
          'failed',
        ).select(),
      },
      (status) => status as ExecutionStatus,
    )
    .otherwise((dbValue) => {
      throw new Error(`Unknown excution status ${dbValue.status}`);
    }),
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
});

@Injectable()
export class PrismaWorkflowExecutionAdapter implements WorkflowExecutionRepository {
  constructor(private prismaService: PrismaService) {}

  async getWorkflowExecutionsBySchemaId(
    schemaId: string,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'> | undefined> {
    const prisma = await this.prismaService.workflowExecution.findFirst({
      where: { workflowSchemaId: schemaId },
    });

    return prisma ? fromPrismaToDomain(prisma) : undefined;
  }

  async getWorkflowExecutionsByWorkflowId(
    workflowId: string,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>[]> {
    const prisma = await this.prismaService.workflowExecution.findMany({
      where: {
        workflowId,
      },
    });
    return prisma.map(fromPrismaToDomain);
  }

  async update(
    id: string,
    data: Partial<
      Omit<WorkflowExecution, 'id' | 'createdAt' | 'workflowSchema'>
    >,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>> {
    const prisma = await this.prismaService.workflowExecution.update({
      where: { id },
      data,
    });

    return fromPrismaToDomain(prisma);
  }

  async create(
    data: Omit<WorkflowExecution, 'id' | 'createdAt'>,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>> {
    const prisma = await this.prismaService.workflowExecution.create({
      data: {
        id: randomUUID(),
        status: data.status,
        workflowId: data.workflowSchema.workflowId,
        workflowSchemaId: data.workflowSchema.id,
      },
    });
    return fromPrismaToDomain(prisma);
  }

  async getWithWorkflowSchema(id: string): Promise<WorkflowExecution> {
    const prisma = await this.prismaService.workflowExecution.findUnique({
      where: { id },
      include: { workflowSchema: true },
    });

    return match(prisma)
      .with({ workflowSchema: P.nonNullable }, (withSchema) => ({
        ...fromPrismaToDomain(withSchema),
        workflowSchema: fromPrismaToWorkflowSchema(withSchema.workflowSchema),
      }))
      .otherwise(() => {
        throw new Error(`Schema not found for workflow execution ${id}`);
      });
  }
}

export const WorkflowExecutionRepositoryToken = Symbol(
  'WorkflowExecutionRepository',
);
export const WorkflowExecutionRepositoryProvider: Provider = {
  provide: WorkflowExecutionRepositoryToken,
  useClass: PrismaWorkflowExecutionAdapter,
};
