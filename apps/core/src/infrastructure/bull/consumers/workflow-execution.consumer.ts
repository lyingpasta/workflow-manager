import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { StartWorkflowExecutionUseCase } from 'src/domain/use-case/start-workflow-execution.use-case';
import { WORKFLOW_EXECUTION_QUEUE } from 'src/value-objects/bullmq';
import { match, P } from 'ts-pattern';

@Processor(WORKFLOW_EXECUTION_QUEUE)
export class WorkflowExecutionEventConsumer extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => StartWorkflowExecutionUseCase))
    private readonly startWorkflowExecutionUseCase: StartWorkflowExecutionUseCase
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    return match(job).with({
      name: "start",
      data: { workflowExecutionId: P.string.select() }
    }, (workflowExecutionId) => this.startWorkflowExecutionUseCase.execute({ workflowExecutionId })).otherwise(() => {
      console.warn(`Corrupted event received ${{ name: job.name, data: job.data }}`)
    })
  }
}
