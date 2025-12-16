import { Module } from "@nestjs/common";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";
import { CreateWorkflowUseCase } from "./use-case/create-workflow.use-case";
import { StartWorkflowExecutionUseCase } from "./use-case/start-workflow-execution.use-case";

const useCases = [CreateWorkflowUseCase, StartWorkflowExecutionUseCase]

@Module({
  providers: [...useCases],
  imports: [InfrastructureModule],
  exports: [...useCases]
})
export class DomainModule { }
