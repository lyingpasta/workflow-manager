import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { randomUUID } from 'node:crypto';
import { WorkflowExecutionEventProducer } from 'src/infrastructure/bull/producers/workflow-execution.producer';

describe('Create Workflow Execution', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let workflowExecutionEventProducer: WorkflowExecutionEventProducer;
  let workflowId: string;
  let workflowSchemaId: string;
  let producerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    workflowExecutionEventProducer = moduleFixture.get(
      WorkflowExecutionEventProducer,
    );
    prismaService = moduleFixture.get(PrismaService);
    app = moduleFixture.createNestApplication();

    await app.init();

    workflowId = randomUUID();
    workflowSchemaId = randomUUID();
    producerSpy = jest
      .spyOn(workflowExecutionEventProducer, 'produceStartEvent')
      .mockImplementation();
  });

  afterAll(async () => {
    await prismaService.workflowExecution.deleteMany();
    await prismaService.workflowSchema.deleteMany();
    await prismaService.workflow.deleteMany();
  });

  describe('when active workflow and active workflow schema exists ', () => {
    it('should create new workflow execution', async () => {
      const schema = {
        nodes: [
          {
            type: 'transform',
            name: 'add 1',
            operation: '$output=$input.value+1',
          },
        ],
      };
      const workflow = await prismaService.workflow.create({
        data: {
          id: workflowId,
          name: 'test',
          isActive: true,
        },
      });
      const workflowSchema = await prismaService.workflowSchema.create({
        data: {
          id: workflowSchemaId,
          schema,
          isActive: true,
          workflowId: workflowId,
        },
      });
      await request(app.getHttpServer())
        .post(`/executions/${workflow.id}/start`)
        .expect(201);

      const maybeWorkflowExecution =
        await prismaService.workflowExecution.findMany({
          where: {
            workflowId: workflow.id,
          },
        });
      const workflowExecution = maybeWorkflowExecution.find(
        (wfe) =>
          wfe.workflowId === workflow.id &&
          wfe.workflowSchemaId === workflowSchema.id,
      );
      expect(workflowExecution).toBeDefined();
      expect(workflowExecution).toMatchObject(
        expect.objectContaining({
          status: 'created',
          workflowId: workflow.id,
          workflowSchemaId: workflowSchema.id,
        }),
      );
      expect(producerSpy).toHaveBeenCalledWith({
        workflowExecutionId: workflowExecution!.id,
      });
    });
  });
});
