import type { Workflow } from "$lib/types/nodes"

const coreUrl = "http://localhost:3000"
const toWorkflow = (input: any): Workflow => {
  return {
    id: input.id,
    name: input.name,
    isActive: input.isActive,
    createdAt: input.createdAt
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
  console.log(workflow)
  const workflows = await (await fetch(`${coreUrl}/workflows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: workflow.name, isActive: false })
  })).json()

  return workflows.map(toWorkflow)
}
