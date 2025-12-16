import { Module } from "@nestjs/common";
import { WorkflowRepositoryProvider } from "./persistence/prisma-workflow.adapter";
import { PrismaService } from "./persistence/prisma.service";
import { WorkflowSchemaRepositoryProvider } from "./persistence/prisma-workflow-schema.adapter";
import { WorkflowExecutionRepositoryProvider } from "./persistence/prisma-workflow-exection.adapter";

@Module({
  providers: [WorkflowRepositoryProvider, WorkflowSchemaRepositoryProvider, WorkflowExecutionRepositoryProvider, PrismaService],
  exports: [WorkflowRepositoryProvider, WorkflowSchemaRepositoryProvider, WorkflowExecutionRepositoryProvider]
})
export class InfrastructureModule { }
