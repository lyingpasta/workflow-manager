import { Workflow } from "../entities/workflow.entity";

export interface WorkflowRepository {
  create(data: Omit<Workflow, "id" | "createdAt" | "updatedAt">): Promise<Workflow>
}
