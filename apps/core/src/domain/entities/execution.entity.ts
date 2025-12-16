import { Workflow } from "./workflow.entity"

export type ExecutionStatus = "started" | "ongoing" | "succeeded" | "failed"

export type Execution = {
  id: string,
  workflow: Workflow,
  status: ExecutionStatus
  createdAt: Date,
  updatedAt?: Date

}


