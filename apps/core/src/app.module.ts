import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainModule } from './domain/domain.module';
import { WorkflowSchemaController } from './infrastructure/controllers/workflow-schema.controller';
import { ConfigModule } from '@nestjs/config';
import { WorkflowExecutionController } from './infrastructure/controllers/workflow-execution.controller';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowController } from './infrastructure/controllers/workflow.controller';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6380,
      },
    }),
    InfrastructureModule,
    DomainModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [WorkflowController, WorkflowExecutionController, WorkflowSchemaController],
  providers: [],
})
export class AppModule { }
