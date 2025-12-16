import { Body, Controller, Post } from "@nestjs/common";
import { CreateWorkflowUseCase } from "src/domain/use-case/create-workflow.use-case.js";
import { CreateWorkflowDTO } from "./dto/create-workflow.dto.js";

@Controller("/workflow")
export class WorkflowController {
  constructor(private createWorkflowUseCase: CreateWorkflowUseCase) { }

  @Post()
  createWorkflow(@Body() input: CreateWorkflowDTO) {
    return this.createWorkflowUseCase.execute(input)
  }
}
