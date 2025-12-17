import { convertToWorkflowNode, WorkflowNode } from "./workflow-node.entity"

describe("Workflow Nodes", () => {
  const cases = {
    transform: {
      ok: [{
        id: "0",
        type: 'transform',
        operation: "add",
        paths: ["test"],
        name: 'add 1',
        isStart: true,
        isEnd: false
      }, {
        id: "1",
        type: 'transform',
        operation: "add",
        paths: ["test"],
        name: 'add 1',
        isStart: false,
        isEnd: true
      }],
      nok: []
    },
    extract:
    {
      ok: [{
        type: "extract",
        source: "node",
        paths: [{ path: "test" }],
        id: "0",
        name: 'add 1',
        isStart: true,
        isEnd: false
      }, {
        type: "extract",
        source: "job",
        paths: [{ path: "test", outputPath: "test" }],
        id: "0",
        name: 'add 1',
        isStart: true,
        isEnd: false
      }]
    }
  }

  describe.each(Object.keys(cases))("%s", (key) => {
    it.each(cases[key].ok)(`should convert it to ${key} node`, (node) => {
      const result = convertToWorkflowNode(node)
      expect(result).toBeDefined()
      expect(result).toMatchObject(expect.objectContaining({
        type: key,
        operation: key !== "transform" ? undefined : node.operation,
        id: node.id,
        paths: node.paths,
        isStart: node.isStart,
        isEnd: node.isEnd
      }))
    })
  })
})
