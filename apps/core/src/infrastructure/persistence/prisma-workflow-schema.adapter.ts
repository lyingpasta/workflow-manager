import { Inject, Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { WorkflowSchema } from "src/domain/entities/workflow-schema.entity";
import { WorkflowSchema as PersistedWorkflowSchema } from "$prisma/client";
import { randomUUID } from "node:crypto";
import { WorkflowSchemaRepository } from "src/domain/repositories/workflow-schema.repository";

const fromPrismaToDomain = (prisma: PersistedWorkflowSchema): WorkflowSchema => ({
  id: prisma.id,
  schema: prisma.schema?.toString(),
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
  workflowId: prisma.workflowId,
  isActive: prisma.isActive
})

@Injectable()
export class PrismaWorkflowSchemaAdapter implements WorkflowSchemaRepository {
  constructor(
    @Inject()
    private readonly prismaService: PrismaService
  ) { }

  async create(data: Omit<WorkflowSchema, "id" | "createdAt">): Promise<WorkflowSchema> {
    console.log(data)
    const prisma = await this.prismaService.workflowSchema.create({
      data: {
        ...data,
        schema: data.schema,
        id: randomUUID()
      }
    });
    return fromPrismaToDomain(prisma);
  }
}

export const WorkflowSchemaRepositoryToken = Symbol("WorkflowSchemaRepository")
export const WorkflowSchemaRepositoryProvider: Provider = {
  provide: WorkflowSchemaRepositoryToken,
  useClass: PrismaWorkflowSchemaAdapter
}
