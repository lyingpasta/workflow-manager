import { Inject, Injectable } from '@nestjs/common';
import { WorkflowSchemaRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-schema.adapter';
import { type WorkflowRepository } from '../repositories/workflow.repository';
import { WorkflowRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow.adapter';
import { type WorkflowSchemaRepository } from '../repositories/workflow-schema.repository';
import { Workflow } from '../entities/workflow.entity';
import { WorkflowSchema } from '../entities/workflow-schema.entity';

type CreateWorkflowUseCasePort = {
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'schema' | 'executions'>;
  schema: Omit<
    WorkflowSchema,
    'id' | 'createdAt' | 'workflowId' | 'executions'
  >;
};

type CreateWorkflowUseCaseResult = {
  workflow: Workflow;
  schema: WorkflowSchema;
};

@Injectable()
export class CreateWorkflowUseCase {
  constructor(
    @Inject(WorkflowRepositoryToken)
    private readonly workflowRepository: WorkflowRepository,
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
  ) {}

  async execute(
    port: CreateWorkflowUseCasePort,
  ): Promise<CreateWorkflowUseCaseResult> {
    const workflow = await this.workflowRepository.create(port.workflow);
    const schema = await this.workflowSchemaRepository.create({
      ...port.schema,
      workflowId: workflow.id,
    });

    return { workflow, schema };
  }
}
