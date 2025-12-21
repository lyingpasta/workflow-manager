import { getWorkflows } from "$lib/client/core";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const workflows = await getWorkflows()

  return {
    workflows
  }
}
