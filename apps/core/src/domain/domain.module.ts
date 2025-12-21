import { forwardRef, Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CreateWorkflowUseCase } from './use-case/create-workflow.use-case';
import { StartWorkflowExecutionUseCase } from './use-case/start-workflow-execution.use-case';
import { CreateWorkflowExecutionUseCase } from './use-case/create-workflow-execution.use-case';
import { NodeService } from './services/node.service';
import { StartNodeExecutionUseCase } from './use-case/start-node-execution.use-case';
import { WorkflowService } from './services/workflow.service';
import { GetWorkflowListUseCase } from './use-case/get-workflow-list.use-case';
import { GetWorkflowSchemaUseCase } from './use-case/get-workflow-schema.use-case';
import { SaveWorkflowSchemaUseCase } from './use-case/save-workflow-schema.use-case';

const useCases = [
  CreateWorkflowExecutionUseCase,
  CreateWorkflowUseCase,
  StartWorkflowExecutionUseCase,
  GetWorkflowListUseCase,
  GetWorkflowSchemaUseCase,
  StartNodeExecutionUseCase,
  SaveWorkflowSchemaUseCase
];

@Module({
  providers: [...useCases, NodeService, WorkflowService],
  imports: [forwardRef(() => InfrastructureModule)],
  exports: [...useCases],
})
export class DomainModule { }
