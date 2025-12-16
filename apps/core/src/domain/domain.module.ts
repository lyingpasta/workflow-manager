import { Module } from "@nestjs/common";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";
import { CreateWorkflowUseCase } from "./use-case/create-workflow.use-case";

@Module({
  providers: [CreateWorkflowUseCase],
  imports: [InfrastructureModule],
  exports: [CreateWorkflowUseCase]
})
export class DomainModule { }
