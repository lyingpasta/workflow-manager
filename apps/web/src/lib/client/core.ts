import type { WorkflowSchema, Workflow } from "$lib/types/workflow"

const coreUrl = "http://localhost:3000"
const toWorkflow = (input: any): Workflow => {
  return {
    id: input.id,
    name: input.name,
    isActive: input.isActive,
    createdAt: input.createdAt
  }
}
const toWorkflowSchema = (input: any): WorkflowSchema => {
  return {
    id: input.id,
    isActive: input.isActive,
    schema: input.schema,
    workflowId: input.workflowId
  }
}

export async function getWorkflows(): Promise<Workflow[]> {
  const workflows = await (await fetch(`${coreUrl}/workflows`, {
    method: "GET"
  })).json()

  if (workflows.length > 0) {
    return workflows.map(toWorkflow)
  } else {
    return []
  }
}

export async function createWorkflow(workflow: Pick<Workflow, "name">): Promise<Workflow> {
  const res = await (await fetch(`${coreUrl}/workflows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: workflow.name, isActive: false })
  })).json()

  return toWorkflow(res)
}

export async function getWorkflowSchema(workflowId: string): Promise<WorkflowSchema> {
  const workflowSchema = await (await fetch(`${coreUrl}/schemas?workflowId=${workflowId}`)).json()
  return toWorkflowSchema(workflowSchema)
}

export async function saveWorkflowSchema(workflowSchema: Pick<WorkflowSchema, "id" | "schema">) {
  await (await fetch(`${coreUrl}/schemas`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(workflowSchema)
  })).json()
}
