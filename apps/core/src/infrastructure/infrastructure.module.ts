import { Module } from "@nestjs/common";
import { WorkflowRepositoryProvider } from "./persistence/prisma-workflow.adapter.js";
import { PrismaService } from "./persistence/prisma.service.js";

@Module({
  providers: [WorkflowRepositoryProvider, PrismaService],
  exports: [WorkflowRepositoryProvider]
})
export class InfrastructureModule { }
