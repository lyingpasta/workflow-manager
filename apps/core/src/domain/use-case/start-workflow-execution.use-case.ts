import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { WorkflowExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-workflow-exection.adapter';
import { type WorkflowExecutionRepository } from '../repositories/workflow-execution.repository';
import { match, P } from 'ts-pattern';
import { WorkflowExecution } from '../entities/workflow-execution.entity';
import {
  convertToWorkflowNode,
  WorkflowNode,
} from '../entities/workflow-node.entity';
import { NodeExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-node-exection.adapter';
import { type NodeExecutionRepository } from '../repositories/node-execution.repository';
import { NodeExecutionEventProducer } from 'src/infrastructure/bull/producers/node-execution.producer';
import { WorkflowService } from '../services/workflow.service';

type StartWorkflowExecutionUseCasePort = {
  workflowExecutionId: string;
  input: any
};

@Injectable()
export class StartWorkflowExecutionUseCase {
  constructor(
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
    @Inject(NodeExecutionRepositoryToken)
    private readonly nodeExecutionRepository: NodeExecutionRepository,
    @Inject(forwardRef(() => NodeExecutionEventProducer))
    private readonly nodeExecutionEventProducer: NodeExecutionEventProducer,
    @Inject()
    private workflowService: WorkflowService,
  ) { }

  async execute(port: StartWorkflowExecutionUseCasePort): Promise<void> {
    const workflowExecution =
      await this.workflowExecutionRepository.getWithWorkflowSchema(
        port.workflowExecutionId,
      );

    await match(workflowExecution)
      .with({ status: 'created' }, () => this.startExecution(workflowExecution, port.input))
      .otherwise(() => {
        throw new Error(
          `Forbidden operation: wrong workflow status ${workflowExecution.status}`,
        );
      });
  }

  private async startExecution(workflowExecution: WorkflowExecution, input: any) {
    const nodes =
      this.workflowService.getWorkflowExecutionBlueprint(workflowExecution);

    if (!nodes) {
      return;
    }

    const nodesArray = [...nodes.values()];
    return match(nodesArray.find((node) => node.isStart === true))
      .with(P.nonNullable, async (starterNode) => {
        const nodeExecution = await this.nodeExecutionRepository.create({
          status: 'pending',
          nodeId: starterNode.id,
          nextNodeId: starterNode.nextNodeId,
          workflowExecutionId: workflowExecution.id,
          isStart: starterNode.isStart,
          isEnd: starterNode.isEnd,
          input
        });

        return this.nodeExecutionEventProducer.produceStartEvent({
          nodeExecution,
        });
      })
      .otherwise(() => {
        throw new Error(
          `No starter node for execution ${workflowExecution.id}`,
        );
      });
  }
}
