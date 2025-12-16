import { Execution } from "./execution.entity.js"

export type Workflow = {
  id: string,
  name: string,
  isActive: boolean,
  executions: Execution[],
  createdAt: Date,
  updatedAt?: Date
}
