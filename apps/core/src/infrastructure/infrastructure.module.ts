import { Module, OnModuleInit } from '@nestjs/common';
import { WorkflowRepositoryProvider } from './persistence/prisma-workflow.adapter';
import { PrismaService } from './persistence/prisma.service';
import { WorkflowSchemaRepositoryProvider } from './persistence/prisma-workflow-schema.adapter';
import { WorkflowExecutionRepositoryProvider } from './persistence/prisma-workflow-exection.adapter';
import { WorkflowExecutionEventProducer } from './bull/producers/workflow-execution.producer';
import { BullModule } from '@nestjs/bullmq';
import {
  NODE_EXECUTION_QUEUE,
  WORKFLOW_EXECUTION_QUEUE,
} from 'src/value-objects/bullmq';
import { WorkflowExecutionEventConsumer } from './bull/consumers/workflow-execution.consumer';
import { NodeExecutionRepositoryProvider } from './persistence/prisma-node-exection.adapter';

@Module({
  imports: [
    BullModule.registerQueue({ name: WORKFLOW_EXECUTION_QUEUE }),
    BullModule.registerQueue({ name: NODE_EXECUTION_QUEUE }),
  ],
  providers: [
    WorkflowRepositoryProvider,
    WorkflowSchemaRepositoryProvider,
    WorkflowExecutionRepositoryProvider,
    PrismaService,
    WorkflowExecutionEventProducer,
    WorkflowExecutionEventConsumer,
    NodeExecutionRepositoryProvider,
  ],
  exports: [
    WorkflowRepositoryProvider,
    WorkflowSchemaRepositoryProvider,
    WorkflowExecutionRepositoryProvider,
    WorkflowExecutionEventProducer,
    NodeExecutionRepositoryProvider,
  ],
})
export class InfrastructureModule {}
