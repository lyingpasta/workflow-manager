import { Module } from "@nestjs/common";
import { WorkflowRepositoryProvider } from "./persistence/prisma-workflow.adapter";
import { PrismaService } from "./persistence/prisma.service";

@Module({
  providers: [WorkflowRepositoryProvider, PrismaService],
  exports: [WorkflowRepositoryProvider]
})
export class InfrastructureModule { }
