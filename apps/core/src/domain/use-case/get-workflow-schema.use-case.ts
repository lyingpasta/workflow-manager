import { Inject, Injectable } from "@nestjs/common";
import { WorkflowSchemaRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-schema.adapter";
import { type WorkflowSchemaRepository } from "../repositories/workflow-schema.repository";

type GetWorkflowSchemaUseCasePort = string

@Injectable()
export class GetWorkflowSchemaUseCase {
  constructor(
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
  ) { }

  execute(port: GetWorkflowSchemaUseCasePort) {
    return this.workflowSchemaRepository.getByActiveWorkflowId(port)
  }
}
