import { Controller, Inject, Param, Post } from "@nestjs/common";
import { StartWorkflowExecutionUseCase } from "src/domain/use-case/start-workflow-execution.use-case";

@Controller("executions")
export class WorkflowExecutionController {
  constructor(
    @Inject()
    private readonly startWorkflowExecutionUseCase: StartWorkflowExecutionUseCase
  ) { }

  @Post(":id/start")
  startWorkflow(@Param("id") id: string) {
    return this.startWorkflowExecutionUseCase.execute({ workflowId: id })
  }
}
