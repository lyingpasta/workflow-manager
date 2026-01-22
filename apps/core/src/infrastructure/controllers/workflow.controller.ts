import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateWorkflowUseCase } from 'src/domain/use-case/create-workflow.use-case';
import { CreateWorkflowDTO } from './dto/create-workflow.dto';
import { GetWorkflowListUseCase } from 'src/domain/use-case/get-workflow-list.use-case';

@Controller('/workflows')
export class WorkflowController {
  constructor(
    @Inject()
    private readonly createWorkflowUseCase: CreateWorkflowUseCase,
    @Inject()
    private readonly getWorkflowListUseCase: GetWorkflowListUseCase,
  ) {}

  @Post()
  createWorkflow(@Body() input: CreateWorkflowDTO) {
    return this.createWorkflowUseCase.execute({ workflow: input });
  }

  @Get()
  getWorkflowList() {
    return this.getWorkflowListUseCase.execute();
  }
}
