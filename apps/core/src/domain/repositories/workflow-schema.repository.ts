import { WorkflowSchema } from "../entities/workflow-schema.entity.js";

export interface WorkflowSchemaRepository {
  create(data: Omit<WorkflowSchema, "id" | "createdAt">): Promise<WorkflowSchema>
}
