import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { WORKFLOW_EXECUTION_QUEUE } from 'src/value-objects/bullmq';

@Injectable()
export class WorkflowExecutionEventProducer {
  constructor(
    @InjectQueue(WORKFLOW_EXECUTION_QUEUE)
    private workflowExecutionQueue: Queue,
  ) {}

  produceStartEvent(input: { workflowExecutionId: string }): Promise<Job> {
    return this.workflowExecutionQueue.add('start', input);
  }
}
