import { getWorkflowSchema } from "$lib/client/core";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const schema = await getWorkflowSchema(params.id)
  if (schema) {
    return {
      schema
    }
  }
  return redirect(404, "/?error=schema_not_found")
}
