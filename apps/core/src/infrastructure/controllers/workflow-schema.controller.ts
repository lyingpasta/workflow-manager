import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { SaveWorkflowSchemaUseCase } from 'src/domain/use-case/save-workflow-schema.use-case';
import { SaveWorkflowSchemaDTO } from './dto/save-workflow-schema.dto';

@Controller('/schemas')
export class WorkflowSchemaController {
  constructor(
    @Inject()
    private readonly saveWorkflowSchemaUseCase: SaveWorkflowSchemaUseCase
  ) { }

  @Patch()
  createWorkflow(@Body() input: SaveWorkflowSchemaDTO) {
    return this.saveWorkflowSchemaUseCase.execute(input);
  }
}
