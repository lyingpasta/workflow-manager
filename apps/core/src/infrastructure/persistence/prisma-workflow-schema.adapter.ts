import { Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { WorkflowSchema } from "src/domain/entities/workflow-schema.entity.js";
import { WorkflowSchema as PersistedWorkflowSchema } from "../generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import { WorkflowSchemaRepository } from "src/domain/repositories/workflow-schema.repository.js";

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
  constructor(private prismaService: PrismaService) { }

  async create(data: Omit<WorkflowSchema, "id" | "createdAt">): Promise<WorkflowSchema> {
    const prisma = await this.prismaService.workflowSchema.create({
      data: {
        ...data,
        schema: JSON.parse(data.schema ?? "{}"),
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
