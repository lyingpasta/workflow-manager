export type NodeType = 'extract' | 'transform' | 'load';

export type NodeFlowArrow = {
  fromNodeId: string;
  toNodeId: string;
}
