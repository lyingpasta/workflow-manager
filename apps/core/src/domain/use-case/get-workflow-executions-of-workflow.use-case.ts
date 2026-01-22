import { Inject, Injectable } from '@nestjs/common';
import { WorkflowExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-exection.adapter';
import type { WorkflowExecutionRepository } from '../repositories/workflow-execution.repository';

type GetWorkflowExecutionsOfWorkflowUseCasePort = { workflowId: string };

@Injectable()
export class GetWorkflowExecutionsOfWorkflowUseCase {
  constructor(
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
  ) {}

  execute(port: GetWorkflowExecutionsOfWorkflowUseCasePort) {
    return this.workflowExecutionRepository.getWorkflowExecutionsByWorkflowId(
      port.workflowId,
    );
  }
}
