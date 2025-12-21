import * as v from 'valibot'
import { command } from "$app/server";
import { saveWorkflowSchema } from "$lib/client/core";
import type { WorkflowSchema } from "$lib/types/workflow";

export const submitWorkflowSchema = command(v.object({ id: v.string(), schema: v.any() }), async (data: Pick<WorkflowSchema, "id" | "schema">) => {
  await saveWorkflowSchema(data)
})
