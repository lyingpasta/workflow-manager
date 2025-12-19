import { Inject, Injectable } from '@nestjs/common';
import { WorkflowRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow.adapter';
import { type WorkflowRepository } from '../repositories/workflow.repository';
import { Workflow } from '../entities/workflow.entity';

@Injectable()
export class GetWorkflowListUseCase {
  constructor(
    @Inject(WorkflowRepositoryToken)
    private readonly workflowRepository: WorkflowRepository,
  ) {}

  execute(): Promise<Workflow[]> {
    return this.workflowRepository.getAll();
  }
}
