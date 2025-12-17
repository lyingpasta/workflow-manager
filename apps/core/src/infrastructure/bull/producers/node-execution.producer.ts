import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { WorkflowNodeExecution } from 'src/domain/entities/workflow-node.entity';
import { NODE_EXECUTION_QUEUE } from 'src/value-objects/bullmq';

@Injectable()
export class NodeExecutionEventProducer {
  constructor(
    @InjectQueue(NODE_EXECUTION_QUEUE)
    private nodeExecutionQueue: Queue,
  ) {}

  produceStartEvent(input: {
    nodeExecution: WorkflowNodeExecution;
    input?: any;
  }): Promise<Job> {
    return this.nodeExecutionQueue.add('start', input);
  }
}
