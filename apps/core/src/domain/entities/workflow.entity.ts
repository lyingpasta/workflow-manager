import { WorkflowExecution } from "./workflow-execution.entity"

export type Workflow = {
  id: string,
  name: string,
  isActive: boolean,
  executions: WorkflowExecution[],
  createdAt: Date,
  updatedAt?: Date
}
