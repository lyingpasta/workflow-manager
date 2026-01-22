import { WorkflowExecution } from '../entities/workflow-execution.entity';

export interface WorkflowExecutionRepository {
  create(
    data: Omit<WorkflowExecution, 'id' | 'createdAt'>,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>>;
  getWithWorkflowSchema(id: string): Promise<WorkflowExecution>;
  update(
    id: string,
    data: Partial<
      Omit<WorkflowExecution, 'id' | 'createdAt' | 'workflowSchema'>
    >,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>>;
  getWorkflowExecutionsByWorkflowId(
    workflowId: string,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'>[]>;
  getWorkflowExecutionsBySchemaId(
    schemaId: string,
  ): Promise<Omit<WorkflowExecution, 'workflowSchema'> | undefined>;
}
