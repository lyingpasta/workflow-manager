import { Inject, Injectable } from "@nestjs/common"
import { WorkflowSchemaRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-schema.adapter"
import { type WorkflowSchemaRepository } from "../repositories/workflow-schema.repository"
import { WorkflowExecutionRepositoryToken } from "src/infrastructure/persistence/prisma-workflow-exection.adapter"
import { type WorkflowExecutionRepository } from "../repositories/workflow-execution.repository"

type StartWorkflowExecutionUseCasePort = {
  workflowId: string
}

@Injectable()
export class StartWorkflowExecutionUseCase {
  constructor(
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
  ) { }

  async execute(port: StartWorkflowExecutionUseCasePort): Promise<void> {
    const workflowSchema = await this.workflowSchemaRepository.getByActiveWorkflowId(port.workflowId)
    await this.workflowExecutionRepository.create({
      workflowSchema,
      status: "created"
    })

    // add execution to queue
  }
}
