import { WorkflowSchema } from "../entities/workflow-schema.entity";

export interface WorkflowSchemaRepository {
  create(data: Omit<WorkflowSchema, "id" | "createdAt">): Promise<WorkflowSchema>
  getByActiveWorkflowId(workflowId: string): Promise<WorkflowSchema>
}
