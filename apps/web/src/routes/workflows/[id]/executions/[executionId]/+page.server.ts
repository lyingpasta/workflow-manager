import { getWorkflowExecutionWithSchema } from "$lib/client/core";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const executionId = params.executionId

  const workflowExecution = await getWorkflowExecutionWithSchema(executionId)
  return {
    workflowExecution
  }
}
