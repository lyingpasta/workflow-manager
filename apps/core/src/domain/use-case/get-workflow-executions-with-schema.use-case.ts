import { Inject, Injectable } from "@nestjs/common";
import { WorkflowExecutionRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-exection.adapter";
import type { WorkflowExecutionRepository } from "../repositories/workflow-execution.repository";

type GetWorkflowExecutionWithSchemaUseCasePort = string

@Injectable()
export class GetWorkflowExecutionWithSchemaUseCase {
  constructor(
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository
  ) { }

  execute(port: GetWorkflowExecutionWithSchemaUseCasePort) {
    return this.workflowExecutionRepository.getWithWorkflowSchema(port)
  }
}
