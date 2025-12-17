import { ExtractNode, WorkflowNode } from '../entities/workflow-node.entity';
import { NodeService } from './node.service';

describe('Node service', () => {
  const service: NodeService = new NodeService();

  const input = {
    first: 'firstValue',
    second: 'secondValue',
    third: 'thirdValue',
  };

  describe('Extract Nodes', () => {
    describe('when processing extract nodes without outputPath', () => {
      it('should output same values as same props', () => {
        const extract: ExtractNode = {
          type: 'extract',
          source: 'node',
          paths: [{ path: 'first' }],
        };
        const output = service.process(input, buildWorkflowNode(extract));
        expect(output).toBeDefined();
        expect(output).toEqual({
          first: 'firstValue',
        });
      });
    });

    describe('when processing extract nodes with outputPath', () => {
      it('should output same values as new props', () => {
        const extract: ExtractNode = {
          type: 'extract',
          source: 'node',
          paths: [{ path: 'first', outputPath: 'new' }],
        };
        const output = service.process(input, buildWorkflowNode(extract));
        expect(output).toBeDefined();
        expect(output).toEqual({
          new: 'firstValue',
        });
      });
    });

    describe('when processing extract nodes with multipe paths', () => {
      it('should output with all paths', () => {
        const extract: ExtractNode = {
          type: 'extract',
          source: 'node',
          paths: [
            { path: 'first', outputPath: 'new' },
            { path: 'second' },
            { path: 'third', outputPath: 'foo' },
          ],
        };
        const output = service.process(input, buildWorkflowNode(extract));
        expect(output).toBeDefined();
        expect(output).toEqual({
          new: 'firstValue',
          second: 'secondValue',
          foo: 'thirdValue',
        });
      });
    });
  });
});

function buildWorkflowNode(node: ExtractNode): WorkflowNode {
  return {
    ...node,
    id: '0',
    isStart: false,
    isEnd: false,
  };
}
