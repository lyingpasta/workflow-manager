export type WorkflowSchema = {
  id: string,
  schema?: string,
  workflowId: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt?: Date
}
