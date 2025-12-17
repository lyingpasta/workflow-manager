import { match, P } from 'ts-pattern';

type ExtractSource = 'job' | 'node';
type ExtractNode = {
  type: 'extract';
  source: ExtractSource;
  paths: {
    path: string;
    outputPath?: string;
  }[];
};

type TransformOperation = 'add' | 'substract' | 'append' | 'concat';
type TransformNode = {
  type: 'transform';
  operation: TransformOperation;
  paths: string[];
};

type LoadNode = {
  type: 'load';
  path: string;
};

type ControlOperation = 'condition' | 'switch' | 'merge' | 'split' | 'loop';
type ControlNode = {
  type: 'control';
  operation: ControlOperation;
};

export type WorkflowNode = (
  | ExtractNode
  | TransformNode
  | LoadNode
  | ControlNode
) & { id: string; nextNodeId?: string, isStart: boolean, isEnd: boolean };

const convertToOperationNode = (
  node: any,
): ExtractNode | TransformNode | LoadNode | ControlNode =>
  match(node)
    .with(
      {
        type: 'extract',
        source: P.union('job', 'node'),
        paths: P.array({ path: P.string, outputPath: P.string.optional() }),
      },
      (node) => node satisfies ExtractNode,
    )
    .with(
      {
        type: 'transform',
        operation: P.union('add', 'substract', 'append', 'concat'),
        paths: P.array(P.string),
      },
      (node) => node satisfies TransformNode,
    )
    .with(
      {
        type: 'load',
        path: P.string,
      },
      (node) => node satisfies LoadNode,
    )
    .with(
      {
        type: 'control',
        operation: P.union('condition', 'switch', 'merge', 'split', 'loop'),
      },
      (node) => node satisfies ControlNode,
    )
    .otherwise(() => {
      throw new Error(`Unknow node type ${JSON.stringify(node)}`);
    });

export const convertToWorkflowNode = (node: any): WorkflowNode =>
  match(node)
    .with(
      {
        id: P.string,
        nextNodeId: P.string.optional(),
        isStart: P.boolean,
        isEnd: P.boolean
      },
      (node) =>
        ({
          ...convertToOperationNode(node),
          id: node.id,
          nextNodeId: node.nextNodeId,
          isStart: node.isStart,
          isEnd: node.isEnd
        }) satisfies WorkflowNode,
    )
    .otherwise(() => {
      throw new Error(`Missing identifier in ${node}`);
    });

export type ExecutionStatus =
  | 'pending'
  | 'started'
  | 'ongoing'
  | 'succeeded'
  | 'failed';

export type WorkflowNodeExecution = {
  id: string;
  nodeId: string;
  nextNodeId?: string;
  status: ExecutionStatus;
  isStart: boolean,
  isEnd: boolean,
  input?: any;
  output?: any;
  createdAt: Date;
  updatedAt?: Date;
  workflowExecutionId: string;
};
