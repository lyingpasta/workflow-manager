import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { StartNodeExecutionUseCase } from 'src/domain/use-case/start-node-execution.use-case';
import { NODE_EXECUTION_QUEUE } from 'src/value-objects/bullmq';
import { match, P } from 'ts-pattern';

@Processor(NODE_EXECUTION_QUEUE)
export class NodeExecutionEventConsumer extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => StartNodeExecutionUseCase))
    private readonly startNodeExecutionUseCase: StartNodeExecutionUseCase,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    return match(job)
      .with(
        {
          name: 'start',
          data: {
            nodeExecution: {
              id: P.string,
              nodeId: P.string,
              nextNodeId: P.string.optional(),
              isStart: P.boolean,
              isEnd: P.boolean,
              status: 'pending',
              workflowExecutionId: P.string,
              createdAt: P.string,
            },
            input: P.nonNullable,
          },
        },
        (job) => this.startNodeExecutionUseCase.execute({ input: job.data.input, nodeExecution: { ...job.data.nodeExecution, createdAt: new Date(job.data.nodeExecution.createdAt) } }),
      )
      .otherwise(() => {
        console.warn(
          `Corrupted event received ${JSON.stringify({ name: job.name, data: job.data })}`,
        );
      });
  }
}
