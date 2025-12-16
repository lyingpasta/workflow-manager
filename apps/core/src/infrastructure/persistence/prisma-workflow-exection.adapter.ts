import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { WorkflowExecutionRepository } from "src/domain/repositories/workflow-execution.repository";
import { ExecutionStatus, WorkflowExecution } from "src/domain/entities/workflow-execution.entity";
import { WorkflowExecution as PersistedWorkflowExecution } from "$prisma/client";
import { randomUUID } from "node:crypto";
import { match, P } from "ts-pattern";

const fromPrismaToDomain = (prisma: PersistedWorkflowExecution): Omit<WorkflowExecution, "workflowSchema"> => ({
  id: prisma.id,
  status: match(prisma).with({ status: P.union("started", "ongoing", "succeeded", "failed").select() }, (status) => status as ExecutionStatus).otherwise((dbValue) => { throw new Error(`Unknown excution status ${dbValue.status}`) }),
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined
})

@Injectable()
export class PrismaWorkflowExecutionAdapter implements WorkflowExecutionRepository {
  constructor(private prismaService: PrismaService) { }

  async create(data: Omit<WorkflowExecution, "id" | "createdAt">): Promise<Omit<WorkflowExecution, "workflowSchema">> {
    const prisma = await this.prismaService.workflowExecution.create({
      data: { id: randomUUID(), status: data.status, workflowId: data.workflowSchema.workflowId, workflowSchemaId: data.workflowSchema.id }
    });
    return fromPrismaToDomain(prisma);
  }
}
