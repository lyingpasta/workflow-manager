export type Workflow = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export type WorkflowSchema = {
  id: string,
  workflowId: string,
  schema: any,
  isActive: boolean
}
