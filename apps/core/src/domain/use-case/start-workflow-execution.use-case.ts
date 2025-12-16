import { Inject, Injectable } from '@nestjs/common';
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

type StartWorkflowExecutionUseCasePort = {
  workflowExecutionId: string;
};

@Injectable()
export class StartWorkflowExecutionUseCase {
  constructor(
    @Inject(WorkflowExecutionRepositoryToken)
    private readonly workflowExecutionRepository: WorkflowExecutionRepository,
    @Inject(NodeExecutionRepositoryToken)
    private readonly nodeExecutionRepository: NodeExecutionRepository,
    @Inject()
    private readonly nodeExecutionEventProducer: NodeExecutionEventProducer
  ) { }

  async execute(port: StartWorkflowExecutionUseCasePort): Promise<void> {
    const workflowExecution =
      await this.workflowExecutionRepository.getWithWorkflowSchema(
        port.workflowExecutionId,
      );
    return match(workflowExecution)
      .with({ status: 'created' }, () => this.startExecution(workflowExecution))
      .otherwise(() => {
        throw new Error(
          `Forbidden operation: wrong workflow status ${workflowExecution.status}`,
        );
      });
  }

  private async startExecution(workflowExecution: WorkflowExecution) {
    const nodes = this.prepareWorkflowExecutionData(workflowExecution);
    if (!nodes) {
      return;
    }

    await Promise.all([...nodes.values()].map(async (node) => {
      const execution = await this.nodeExecutionRepository.create({
        status: "pending",
        nodeId: node.id,
        nextNodeId: node.nextNodeId,
        workflowExecutionId: workflowExecution.id,
        isStart: node.isStart,
        isEnd: node.isEnd
      })

      return this.nodeExecutionEventProducer.produceStartEvent(execution)
    }));
  }

  private prepareWorkflowExecutionData(workflowExecution: WorkflowExecution) {
    return match(workflowExecution.workflowSchema.schema)
      .with({ nodes: P.array(P.any), flows: P.array(P.any) }, (schema) =>
        this.buildNodesTreeMap(schema),
      )
      .otherwise(() => {
        throw new Error(
          `Corrupted schema! id: ${workflowExecution.workflowSchema.id}`,
        );
      });
  }

  private buildNodesTreeMap(schema: { nodes: any[]; flows: any[] }) {
    const nodesMap: Map<string, WorkflowNode> = new Map(
      schema.nodes.map((node: any) => [node.id, convertToWorkflowNode(node)]),
    );
    for (let maybeFlowArrow of schema.flows as any[]) {
      match(maybeFlowArrow)
        .with({ from: P.string, to: P.string }, (arrowFlow) => {
          const node = nodesMap.get(arrowFlow.from);
          const nextNode = nodesMap.get(arrowFlow.to);
          if (node && nextNode && !node.nextNodeId) {
            node.nextNodeId = nextNode.id;
            nodesMap.set(node.id, node);
          } else {
            console.error(`Unattached arrow destination, ignoring...`);
          }
        })
        .otherwise(() => {
          throw new Error('Corrupted arrow data');
        });
      return nodesMap;
    }
  }
}
