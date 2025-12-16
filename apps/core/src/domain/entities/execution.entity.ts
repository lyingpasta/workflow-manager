import { WorkflowSchema } from "./workflow-schema.entity"

export type ExecutionStatus = "started" | "ongoing" | "succeeded" | "failed"

export type Execution = {
  id: string,
  workflowSchema: WorkflowSchema,
  status: ExecutionStatus
  createdAt: Date,
  updatedAt?: Date
}


