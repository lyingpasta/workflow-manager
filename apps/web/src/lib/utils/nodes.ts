import type { CanvasNode } from "$lib/types/canvas";
import type { NodeFlowArrow } from "$lib/types/nodes";
import type { WorkflowSchema } from "$lib/types/workflow";
import { match, P } from "ts-pattern";

export const buildNodeTree = ({ schema }: WorkflowSchema): { nodes: Map<string, CanvasNode>, arrowFlows: NodeFlowArrow[] } => {
  const nodesMap = match(schema).with({ nodes: P.array(P.any).select() }, (nodes: any) => {
    const nodesMap = new Map()
    for (let node of nodes) {
      nodesMap.set(node.id, node)
    }
    return nodesMap
  }).otherwise(() => new Map())

  const arrowFlows = schema?.flows ?? []
  return { nodes: nodesMap, arrowFlows }
}

export const buildSchemaFromTree = (input: { nodes: Map<string, CanvasNode>, arrowFlows: NodeFlowArrow[] }): Pick<WorkflowSchema, "schema"> => {
  const nodes = Array.from(input.nodes.values())
  return ({ schema: { nodes, flows: input.arrowFlows } })
}
