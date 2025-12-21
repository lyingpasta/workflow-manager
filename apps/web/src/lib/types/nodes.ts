export type NodeType = 'extract' | 'transform' | 'load';

export type NodeFlowArrow = {
  fromNodeId: string;
  toNodeId: string;
}

export type Workflow = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};
