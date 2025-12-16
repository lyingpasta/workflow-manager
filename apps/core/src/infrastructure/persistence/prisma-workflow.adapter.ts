import { Injectable, Provider } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { Workflow } from "src/domain/entities/workflow.entity.js";
import { randomUUID } from "node:crypto";
import { Workflow as PersistedWorkflow } from "../generated/prisma/client.js";
import { WorkflowRepository } from "src/domain/repositories/workflow.repository.js";

const fromPrismaToDomain = (prisma: PersistedWorkflow): Workflow => ({
  id: prisma.id,
  name: prisma.name,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt ?? undefined,
  executions: [],
  isActive: prisma.isActive
})

@Injectable()
export class PrismaWorkflowAdapter implements WorkflowRepository {
  constructor(private prismaService: PrismaService) { }

  async create(workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "executions">): Promise<Workflow> {
    const prisma = await this.prismaService.workflow.create({
      data: {
        ...workflow,
        id: randomUUID(),
      }
    });
    return fromPrismaToDomain(prisma);
  }
}

export const WorkflowRepositoryToken = "WorkflowRepository"
export const WorkflowRepositoryProvider: Provider = {
  provide: Symbol(WorkflowRepositoryToken),
  useClass: PrismaWorkflowAdapter
}
