import { WorkflowNodeExecution } from '../entities/workflow-node.entity';

export interface NodeExecutionRepository {
  create(
    data: Omit<WorkflowNodeExecution, 'id' | 'createdAt'>,
  ): Promise<WorkflowNodeExecution>;
  get(id: string): Promise<WorkflowNodeExecution>;
}
