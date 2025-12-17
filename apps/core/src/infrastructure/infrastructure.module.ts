import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
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
import { NodeExecutionEventProducer } from './bull/producers/node-execution.producer';
import { DomainModule } from 'src/domain/domain.module';
import { NodeExecutionEventConsumer } from './bull/consumers/node-execution.consumer';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: NODE_EXECUTION_QUEUE },
      { name: WORKFLOW_EXECUTION_QUEUE },
    ),
    forwardRef(() => DomainModule),
  ],
  providers: [
    WorkflowRepositoryProvider,
    WorkflowSchemaRepositoryProvider,
    WorkflowExecutionRepositoryProvider,
    PrismaService,
    WorkflowExecutionEventProducer,
    WorkflowExecutionEventConsumer,
    NodeExecutionEventProducer,
    NodeExecutionEventConsumer,
    NodeExecutionRepositoryProvider,
  ],
  exports: [
    WorkflowRepositoryProvider,
    WorkflowSchemaRepositoryProvider,
    WorkflowExecutionRepositoryProvider,
    WorkflowExecutionEventProducer,
    NodeExecutionEventProducer,
    NodeExecutionRepositoryProvider,
  ],
})
export class InfrastructureModule {}
