import { Inject } from "@nestjs/common";
import { WorkflowSchema } from "../entities/workflow-schema.entity";
import type { WorkflowSchemaRepository } from "../repositories/workflow-schema.repository";
import { WorkflowSchemaRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-schema.adapter";
import { WorkflowExecutionRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-exection.adapter";
import type { WorkflowExecutionRepository } from "../repositories/workflow-execution.repository";

type SaveWorkflowSchemaUseCasePort = Pick<WorkflowSchema, "id" | "schema">

export class SaveWorkflowSchemaUseCase {
  constructor(
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository) { }

  async execute(port: SaveWorkflowSchemaUseCasePort) {
    const exisitingExecution = await this.workflowExecutionRepository.getWorkflowExecutionsBySchemaId(port.id)
    if (exisitingExecution) {
      const schema = await this.workflowSchemaRepository.get(exisitingExecution.workflowSchemaId)
      await this.workflowSchemaRepository.update(port.id, { isActive: false })
      return this.workflowSchemaRepository.create({
        schema: port.schema,
        isActive: true,
        workflowId: schema.workflowId,
      })
    }
    return this.workflowSchemaRepository.update(port.id, { schema: port.schema })
  }
}
