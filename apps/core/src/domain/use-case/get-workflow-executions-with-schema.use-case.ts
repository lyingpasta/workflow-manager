import { Inject, Injectable } from '@nestjs/common';
import { WorkflowExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-exection.adapter';
import type { WorkflowExecutionRepository } from '../repositories/workflow-execution.repository';
import { NodeExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-node-exection.adapter';
import type { NodeExecutionRepository } from '../repositories/node-execution.repository';

type GetWorkflowExecutionWithSchemaUseCasePort = string;

@Injectable()
export class GetWorkflowExecutionWithSchemaUseCase {
  constructor(
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
    @Inject(NodeExecutionRepositoryToken)
    private readonly nodeExecutionRepository: NodeExecutionRepository,
  ) {}

  async execute(port: GetWorkflowExecutionWithSchemaUseCasePort) {
    const workflowExecution =
      await this.workflowExecutionRepository.getWithWorkflowSchema(port);

    const nodeExecutions = (
      workflowExecution.workflowSchema.schema?.nodes as { id: string }[]
    ).map((node) =>
      this.nodeExecutionRepository.getByNodeIdAndExecutionId(
        node.id,
        workflowExecution.id,
      ),
    );

    return {
      workflowExecution,
      nodeExecutions,
    };
  }
}
