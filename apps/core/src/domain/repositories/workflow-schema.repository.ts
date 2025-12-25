import { WorkflowSchema } from '../entities/workflow-schema.entity';

export interface WorkflowSchemaRepository {
  create(
    data: Omit<WorkflowSchema, 'id' | 'createdAt'>,
  ): Promise<WorkflowSchema>;
  getByActiveWorkflowId(workflowId: string): Promise<WorkflowSchema>;
  update(id: string, data: Partial<Omit<WorkflowSchema, "id" | "createdAt" | "updatedAt">>): Promise<WorkflowSchema>
  get(id: string): Promise<WorkflowSchema>
}
