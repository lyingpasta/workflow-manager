import { Inject, Injectable } from '@nestjs/common';
import { WorkflowExecution } from '../entities/workflow-execution.entity';
import { match, P } from 'ts-pattern';
import {
  convertToWorkflowNode,
  WorkflowNode,
} from '../entities/workflow-node.entity';
import { NodeExecutionRepositoryToken } from 'src/infrastructure/persistence/prisma-node-exection.adapter';
import { type NodeExecutionRepository } from '../repositories/node-execution.repository';

@Injectable()
export class WorkflowService {
  constructor(
    @Inject(NodeExecutionRepositoryToken)
    private readonly nodeExecutionRepository: NodeExecutionRepository,
  ) {}

  async buildNextNodeExecution(
    workflowExecution: WorkflowExecution,
    nextNodeId: string,
  ) {
    const nextNode =
      this.prepareWorkflowExecutionData(workflowExecution).get(nextNodeId);
    if (!nextNode)
      throw new Error(`Unable to retrieve next node id ${nextNodeId}`);
    const execution = await this.nodeExecutionRepository.create({
      status: 'pending',
      nodeId: nextNode.id,
      nextNodeId: nextNode.nextNodeId,
      workflowExecutionId: workflowExecution.id,
      isStart: nextNode.isStart,
      isEnd: nextNode.isEnd,
    });
    return execution;
  }

  getWorkflowExecutionBlueprint(workflowExecution: WorkflowExecution) {
    return this.prepareWorkflowExecutionData(workflowExecution);
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
    const nodesMap: Map<string, WorkflowNode> = new Map();
    schema.nodes.map((node) =>
      nodesMap.set(node.id, convertToWorkflowNode(node)),
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
    }
    return nodesMap;
  }
}
