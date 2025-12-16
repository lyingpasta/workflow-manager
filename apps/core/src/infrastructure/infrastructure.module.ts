import { Module } from "@nestjs/common";
import { WorkflowRepositoryProvider } from "./persistence/prisma-workflow.adapter";
import { PrismaService } from "./persistence/prisma.service";
import { WorkflowSchemaRepositoryProvider } from "./persistence/prisma-workflow-schema.adapter";

@Module({
  providers: [WorkflowRepositoryProvider, WorkflowSchemaRepositoryProvider, PrismaService],
  exports: [WorkflowRepositoryProvider, WorkflowSchemaRepositoryProvider]
})
export class InfrastructureModule { }
