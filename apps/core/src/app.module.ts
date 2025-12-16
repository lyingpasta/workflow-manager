import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainModule } from './domain/domain.module';
import { WorkflowController } from './infrastructure/controllers/workflow.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [InfrastructureModule, DomainModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [WorkflowController],
  providers: [],
})
export class AppModule { }
