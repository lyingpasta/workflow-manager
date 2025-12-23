import { getWorkflowExecutions } from "$lib/client/core";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  const workflowId = params.id
  const maybeWorkflowExecutionId = params.executionId

  const executions = await getWorkflowExecutions(workflowId)

  const executionWithUrl = executions.map(exec => ({
    ...exec,
    url: `/workflows/${workflowId}/executions/${exec.id}`
  }))

  return {
    executions: executionWithUrl,
    selectedExecution: maybeWorkflowExecutionId
  }
}
