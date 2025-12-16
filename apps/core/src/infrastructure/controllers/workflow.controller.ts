import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateWorkflowUseCase } from 'src/domain/use-case/create-workflow.use-case';
import { CreateWorkflowDTO } from './dto/create-workflow.dto';

@Controller('/workflow')
export class WorkflowController {
  constructor(
    @Inject()
    private readonly createWorkflowUseCase: CreateWorkflowUseCase,
  ) {}

  @Post()
  createWorkflow(@Body() input: CreateWorkflowDTO) {
    return this.createWorkflowUseCase.execute(input);
  }
}
