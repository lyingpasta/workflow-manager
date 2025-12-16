import { Workflow } from "../entities/workflow.entity.js";

export interface WorkflowRepository {
  create(data: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "executions">): Promise<Workflow>
}
