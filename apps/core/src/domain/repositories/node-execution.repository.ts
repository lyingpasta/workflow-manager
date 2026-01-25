import { WorkflowNodeExecution } from '../entities/workflow-node.entity';

export interface NodeExecutionRepository {
  create(
    data: Omit<WorkflowNodeExecution, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WorkflowNodeExecution>;
  get(id: string): Promise<WorkflowNodeExecution>;
  update(
    id: string,
    data: Partial<
      Omit<WorkflowNodeExecution, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<WorkflowNodeExecution>;
  getByNodeIdAndExecutionId(
    nodeId: string,
    executionId: string,
  ): Promise<WorkflowNodeExecution | undefined>;
  getByExecutionId(executionId: string): Promise<WorkflowNodeExecution[]>
}
