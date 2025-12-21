import { BadRequestException, Body, Controller, Get, Inject, Patch, Query } from '@nestjs/common';
import { SaveWorkflowSchemaUseCase } from 'src/domain/use-case/save-workflow-schema.use-case';
import { SaveWorkflowSchemaDTO } from './dto/save-workflow-schema.dto';
import { GetWorkflowSchemaUseCase } from 'src/domain/use-case/get-workflow-schema.use-case';
import { match, P } from 'ts-pattern';

@Controller('/schemas')
export class WorkflowSchemaController {
  constructor(
    @Inject()
    private readonly saveWorkflowSchemaUseCase: SaveWorkflowSchemaUseCase,
    @Inject()
    private readonly getWorkflowSchemaUseCase: GetWorkflowSchemaUseCase
  ) { }

  @Patch()
  saveWorkflowSchema(@Body() input: SaveWorkflowSchemaDTO) {
    return this.saveWorkflowSchemaUseCase.execute(input);
  }

  @Get()
  getWorkflowSchemaByWorkflowId(@Query() query: { workflowId?: string }) {
    return match(query)
      .with({ workflowId: P.string.select() }, (id) => this.getWorkflowSchemaUseCase.execute(id))
      .otherwise(() => {
        throw new BadRequestException("unknown query params")
      })
  }
}
