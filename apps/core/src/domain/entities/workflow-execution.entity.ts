import { WorkflowSchema } from "./workflow-schema.entity"

export type ExecutionStatus = "created" | "started" | "ongoing" | "succeeded" | "failed"

export type WorkflowExecution = {
  id: string,
  workflowSchema: WorkflowSchema,
  status: ExecutionStatus
  createdAt: Date,
  updatedAt?: Date
}


