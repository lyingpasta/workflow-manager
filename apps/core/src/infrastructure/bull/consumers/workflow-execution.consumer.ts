import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WORKFLOW_EXECUTION_QUEUE } from 'src/value-objects/bullmq';

@Processor(WORKFLOW_EXECUTION_QUEUE)
export class WorkflowExecutionEventConsumer extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log(job);
  }
}
