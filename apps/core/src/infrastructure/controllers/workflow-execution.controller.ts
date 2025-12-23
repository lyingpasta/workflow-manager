import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { CreateWorkflowExecutionUseCase } from 'src/domain/use-case/create-workflow-execution.use-case';
import { GetWorkflowExecutionsOfWorkflowUseCase } from 'src/domain/use-case/get-workflow-executions-of-workflow.use-case';

@Controller('executions')
export class WorkflowExecutionController {
  constructor(
    @Inject()
    private readonly createWorkflowExecutionUseCase: CreateWorkflowExecutionUseCase,
    @Inject()
    private readonly getWorkflowExecutionsOfWorkflowUseCase: GetWorkflowExecutionsOfWorkflowUseCase
  ) { }

  @Post(':id/start')
  startWorkflow(@Param('id') id: string) {
    return this.createWorkflowExecutionUseCase.execute({ workflowId: id });
  }

  @Get()
  getListByWorkflow(@Query('worflowId') workflowId: string) {
    return this.getWorkflowExecutionsOfWorkflowUseCase.execute({ workflowId })
  }
}
