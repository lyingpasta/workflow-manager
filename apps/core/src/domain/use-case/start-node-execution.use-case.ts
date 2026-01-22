import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  convertToWorkflowNode,
  WorkflowNodeExecution,
} from '../entities/workflow-node.entity';
import { NodeExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-node-exection.adapter';
import { type NodeExecutionRepository } from '../repositories/node-execution.repository';
import { NodeService } from '../services/node.service';
import { WorkflowExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-exection.adapter';
import { type WorkflowExecutionRepository } from '../repositories/workflow-execution.repository';
import { WorkflowService } from '../services/workflow.service';
import { match, P } from 'ts-pattern';
import { NodeExecutionEventProducer } from 'src/infrastructure/bull/producers/node-execution.producer';

type StartNodeExecutionUseCasePort = {
  nodeExecution: WorkflowNodeExecution;
};

@Injectable()
export class StartNodeExecutionUseCase {
  constructor(
    @Inject(NodeExecutionRepositoryToken)
    private readonly nodeExecutionRepository: NodeExecutionRepository,
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
    @Inject()
    private nodeService: NodeService,
    @Inject()
    private workflowService: WorkflowService,
    @Inject(forwardRef(() => NodeExecutionEventProducer))
    private readonly nodeExecutionEventProducer: NodeExecutionEventProducer,
  ) {}

  async execute(port: StartNodeExecutionUseCasePort): Promise<void> {
    //gather and prepare
    await this.nodeExecutionRepository.update(port.nodeExecution.id, {
      status: 'ongoing',
    });
    const workflowExecution =
      await this.workflowExecutionRepository.getWithWorkflowSchema(
        port.nodeExecution.workflowExecutionId,
      );
    const node = (workflowExecution.workflowSchema.schema.nodes as any[]).find(
      (node) => node.id === port.nodeExecution.nodeId,
    );
    const workflowNode = convertToWorkflowNode(node);

    //execute workflow
    const output = this.nodeService.process(
      port.nodeExecution.input,
      workflowNode,
    );
    await this.nodeExecutionRepository.update(port.nodeExecution.id, {
      status: 'succeeded',
      output,
    });

    //compoute next execution
    await match(port.nodeExecution)
      .with({ isEnd: false, nextNodeId: P.nonNullable }, async (execution) => {
        const nextExecution = await this.workflowService.buildNextNodeExecution(
          workflowExecution,
          execution.nextNodeId,
        );
        //emit event
        return this.nodeExecutionEventProducer.produceStartEvent({
          nodeExecution: nextExecution,
          input: output,
        });
      })
      .with({ isEnd: true }, () => {
        return this.workflowExecutionRepository.update(
          port.nodeExecution.workflowExecutionId,
          { status: 'succeeded' },
        );
      })
      .otherwise(() => {
        console.error(
          `Corrupted schema of workflow execution ${port.nodeExecution.workflowExecutionId}`,
        );
        return this.workflowExecutionRepository.update(
          port.nodeExecution.workflowExecutionId,
          { status: 'failed' },
        );
      });
  }
}
