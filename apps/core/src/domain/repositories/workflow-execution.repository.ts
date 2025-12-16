import { WorkflowExecution } from '../entities/workflow-execution.entity';

export interface WorkflowExecutionRepository {
  create(
    data: Omit<WorkflowExecution, 'id' | 'createdAt'>,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>>;
  getWithWorkflowSchema(id: string): Promise<WorkflowExecution>;
}
