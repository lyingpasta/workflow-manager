import { WorkflowSchema } from "./workflow-schema.entity.js"

export type ExecutionStatus = "started" | "ongoing" | "succeeded" | "failed"

export type Execution = {
  id: string,
  workflowSchema: WorkflowSchema,
  status: ExecutionStatus
  createdAt: Date,
  updatedAt?: Date
}


