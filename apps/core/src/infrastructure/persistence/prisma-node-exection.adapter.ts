import { Injectable, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NodeExecution as PersistedNodeExecution } from '$prisma/client';
import { randomUUID } from 'node:crypto';
import { match, P } from 'ts-pattern';
import { NodeExecutionRepository } from 'src/domain/repositories/node-execution.repository';
import {
  ExecutionStatus,
  WorkflowNodeExecution,
} from 'src/domain/entities/workflow-node.entity';

const fromPrismaToDomain = (
  prisma: PersistedNodeExecution,
): WorkflowNodeExecution => ({
  id: prisma.id,
  nodeId: prisma.nodeId,
  nextNodeId: prisma.nextNodeId ?? undefined,
  workflowExecutionId: prisma.workflowExecutionId,
  input: prisma.input ?? undefined,
  output: prisma.output ?? undefined,
  status: match(prisma)
    .with(
      {
        status: P.union(
          'pending',
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
  isStart: prisma.isStart,
  isEnd: prisma.isEnd,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
});

@Injectable()
export class PrismaNodeExecutionAdapter implements NodeExecutionRepository {
  constructor(private prismaService: PrismaService) { }

  async create(
    data: Omit<WorkflowNodeExecution, 'id' | 'createdAt'>,
  ): Promise<WorkflowNodeExecution> {
    const prisma = await this.prismaService.nodeExecution.create({
      data: {
        id: randomUUID(),
        status: data.status,
        nodeId: data.nodeId,
        nextNodeId: data.nextNodeId,
        isStart: data.isStart,
        isEnd: data.isEnd,
        workflowExecutionId: data.workflowExecutionId,
      },
    });
    return fromPrismaToDomain(prisma);
  }

  async get(id: string): Promise<WorkflowNodeExecution> {
    const prisma = await this.prismaService.nodeExecution.findUniqueOrThrow({
      where: { id },
    });

    return fromPrismaToDomain(prisma);
  }
}

export const NodeExecutionRepositoryToken = Symbol('NodeExecutionRepository');
export const NodeExecutionRepositoryProvider: Provider = {
  provide: NodeExecutionRepositoryToken,
  useClass: PrismaNodeExecutionAdapter,
};
