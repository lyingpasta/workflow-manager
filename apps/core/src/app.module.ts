import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module.js';
import { DomainModule } from './domain/domain.module.js';
import { WorkflowController } from './infrastructure/controllers/workflow.controller.js';

@Module({
  imports: [InfrastructureModule, DomainModule],
  controllers: [WorkflowController],
  providers: [],
})
export class AppModule { }
