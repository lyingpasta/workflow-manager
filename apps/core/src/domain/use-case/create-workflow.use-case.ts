import { Inject } from "@nestjs/common";
import { WorkflowSchemaRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-schema.adapter.js";
import { type WorkflowRepository } from "../repositories/workflow.repository.js";
import { WorkflowRepositoryToken } from "src/infrastructure/persistence/prisma-workflow.adapter.js";
import { type WorkflowSchemaRepository } from "../repositories/workflow-schema.repository.js";
import { Workflow } from "../entities/workflow.entity.js";
import { WorkflowSchema } from "../entities/workflow-schema.entity.js";

type CreateWorkflowUseCasePort = {
  workflow: Omit<Workflow, "id" | "createdAt" | "schema" | "executions">,
  schema: Omit<WorkflowSchema, "id" | "createdAt" | "workflowId" | "executions">
}

type CreateWorkflowUseCaseResult = {
  workflow: Workflow,
  schema: WorkflowSchema
}

export class CreateWorkflowUseCase {
  constructor(
    @Inject(WorkflowRepositoryToken)
    private readonly workflowRepository: WorkflowRepository,
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
  ) { }

  async execute(port: CreateWorkflowUseCasePort): Promise<CreateWorkflowUseCaseResult> {
    const workflow = await this.workflowRepository.create(port.workflow)
    const schema = await this.workflowSchemaRepository.create({ ...port.schema, workflowId: workflow.id })

    return { workflow, schema }
  }
}
