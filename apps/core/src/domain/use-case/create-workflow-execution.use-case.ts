import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { WorkflowSchemaRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-schema.adapter';
import { type WorkflowSchemaRepository } from '../repositories/workflow-schema.repository';
import { WorkflowExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-exection.adapter';
import { type WorkflowExecutionRepository } from '../repositories/workflow-execution.repository';
import { WorkflowExecutionEventProducer } from 'src/infrastructure/bull/producers/workflow-execution.producer';

type CreateWorkflowExecutionUseCasePort = {
  workflowId: string;
  input: any;
};

@Injectable()
export class CreateWorkflowExecutionUseCase {
  constructor(
    @Inject(WorkflowSchemaRepositoryToken)
    private readonly workflowSchemaRepository: WorkflowSchemaRepository,
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
    @Inject(forwardRef(() => WorkflowExecutionEventProducer))
    private readonly workflowExecutionEventProducer: WorkflowExecutionEventProducer,
  ) {}

  async execute(port: CreateWorkflowExecutionUseCasePort): Promise<void> {
    const workflowSchema =
      await this.workflowSchemaRepository.getByActiveWorkflowId(
        port.workflowId,
      );
    const workflowExecution = await this.workflowExecutionRepository.create({
      workflowSchemaId: workflowSchema.id,
      workflowSchema,
      status: 'created',
    });

    // add execution to queue
    await this.workflowExecutionEventProducer.produceStartEvent({
      workflowExecutionId: workflowExecution.id,
      input: port.input,
    });
  }
}
