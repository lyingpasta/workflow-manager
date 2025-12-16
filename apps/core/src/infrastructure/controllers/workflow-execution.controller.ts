import { Controller, Inject, Param, Post } from '@nestjs/common';
import { CreateWorkflowExecutionUseCase } from 'src/domain/use-case/create-workflow-execution.use-case';

@Controller('executions')
export class WorkflowExecutionController {
  constructor(
    @Inject()
    private readonly createWorkflowExecutionUseCase: CreateWorkflowExecutionUseCase,
  ) {}

  @Post(':id/start')
  startWorkflow(@Param('id') id: string) {
    return this.createWorkflowExecutionUseCase.execute({ workflowId: id });
  }
}
