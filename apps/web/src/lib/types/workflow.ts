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

export type WorkflowExecution = {
  id: string;
  workflowSchema: WorkflowSchema;
  status: ExecutionStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export type ExecutionStatus =
  | 'created'
  | 'started'
  | 'ongoing'
  | 'succeeded'
  | 'failed';
