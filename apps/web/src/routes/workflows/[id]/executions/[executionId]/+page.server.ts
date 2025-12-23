import { getWorkflowExecutions } from "$lib/client/core";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const workflowId = params.id

  const executions = await getWorkflowExecutions(workflowId)
  console.log(executions)
  return {
    executions
  }
}
