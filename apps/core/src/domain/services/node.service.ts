import { Injectable } from '@nestjs/common';
import { ExtractNode, WorkflowNode } from '../entities/workflow-node.entity';
import { match } from 'ts-pattern';

@Injectable()
export class NodeService {
  process(input: any, node: WorkflowNode) {
    return match(node)
      .with({ type: 'extract' }, (node) => this.processExtractNode(input, node))
      .with({ type: 'transform' }, (node) =>
        this.processTransformNode(input, node),
      )
      .with({ type: 'load' }, (node) => this.processLoadNode(input, node))
      .with({ type: 'control' }, (node) => this.processControlNode(input, node))
      .exhaustive();
  }

  private processExtractNode(input: any, node: ExtractNode) {
    return match(node)
      .with({ source: 'node' }, () => {
        const output: any = {};
        for (let { path, outputPath } of node.paths) {
          const value = input[path];
          if (outputPath) {
            output[outputPath] = value;
          } else {
            output[path] = value;
          }
        }
        return output;
      })
      .run();
  }

  private processTransformNode(input: any, node: WorkflowNode) {
    return input;
  }

  private processLoadNode(input: any, _node: WorkflowNode) {
    return input;
  }

  private processControlNode(input: any, _node: WorkflowNode) {
    return input;
  }
}
