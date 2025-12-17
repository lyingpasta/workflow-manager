import { match } from 'ts-pattern';
import { convertToWorkflowNode, WorkflowNode } from './workflow-node.entity';

describe('Workflow Nodes', () => {
  const cases = {
    transform: {
      ok: [
        {
          id: '0',
          type: 'transform',
          operation: 'add',
          paths: ['test'],
          name: 'add 1',
          isStart: true,
          isEnd: false,
        },
        {
          id: '1',
          type: 'transform',
          operation: 'add',
          paths: ['test'],
          name: 'add 1',
          isStart: false,
          isEnd: true,
        },
      ],
      nok: [],
    },
    extract: {
      ok: [
        {
          type: 'extract',
          source: 'node',
          paths: [{ path: 'test' }],
          id: '0',
          name: 'add 1',
          isStart: true,
          isEnd: false,
        },
        {
          type: 'extract',
          source: 'job',
          paths: [{ path: 'test', outputPath: 'test' }],
          id: '0',
          name: 'add 1',
          isStart: true,
          isEnd: false,
        },
      ],
    },
  };

  describe.each(Object.keys(cases))('%s', (key) => {
    it.each(cases[key].ok)(`should convert it to ${key} node`, (node) => {
      const result = convertToWorkflowNode(node);
      expect(result).toBeDefined();
      const base = match(key)
        .with('transform', () => ({
          operation: node.operation,
        }))
        .with('extract', () => ({
          source: node.source,
        }))
        .run();

      expect(result).toMatchObject(
        expect.objectContaining({
          ...base,
          nextNodeId: node.nextNodeId,
          name: node.name,
          type: key,
          id: node.id,
          paths: node.paths,
          isStart: node.isStart,
          isEnd: node.isEnd,
        }),
      );
    });
  });
});
