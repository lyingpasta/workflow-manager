import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { NODE_EXECUTION_QUEUE } from 'src/value-objects/bullmq';

@Injectable()
export class NodeExecutionEventProducer {
  constructor(
    @InjectQueue(NODE_EXECUTION_QUEUE)
    private nodeExecutionQueue: Queue,
  ) { }

  produceStartEvent(input: { workflowExecutionId: string }): Promise<Job> {
    return this.nodeExecutionQueue.add('start', input);
  }
}
