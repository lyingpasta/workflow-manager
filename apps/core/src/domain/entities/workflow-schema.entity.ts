export type WorkflowSchema = {
  id: string,
  schema?: any,
  workflowId: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt?: Date
}
