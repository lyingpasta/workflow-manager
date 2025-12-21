import { Inject } from "@nestjs/common";
import { WorkflowSchema } from "../entities/workflow-schema.entity";
import type { WorkflowSchemaRepository } from "../repositories/workflow-schema.repository";
import { WorkflowSchemaRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-schema.adapter";

type SaveWorkflowSchemaUseCasePort = Pick<WorkflowSchema, "id" | "schema">

export class SaveWorkflowSchemaUseCase {
  constructor(
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository) { }

  execute(port: SaveWorkflowSchemaUseCasePort) {
    return this.workflowSchemaRepository.update(port.id, { schema: port.schema })
  }
}
