import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { randomUUID } from 'node:crypto';
import { WorkflowExecutionEventProducer } from 'src/infrastructure/bull/producers/workflow-execution.producer';
import { NodeExecutionEventProducer } from 'src/infrastructure/bull/producers/node-execution.producer';
import { setTimeout } from 'node:timers/promises';

describe('Create Workflow Execution', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let workflowId: string;
  let workflowSchemaId: string;
  let workflowExecutionId: string;
  let workflowExecutionEventProducer: WorkflowExecutionEventProducer
  let nodeExecutionEventProducer: NodeExecutionEventProducer
  let producerSpy: jest.SpyInstance

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    workflowExecutionEventProducer = moduleFixture.get(WorkflowExecutionEventProducer)
    nodeExecutionEventProducer = moduleFixture.get(NodeExecutionEventProducer)
    prismaService = moduleFixture.get(PrismaService);
    app = moduleFixture.createNestApplication();

    await app.init();

    workflowId = randomUUID();
    workflowSchemaId = randomUUID();
    workflowExecutionId = randomUUID();
    producerSpy = jest.spyOn(nodeExecutionEventProducer, "produceStartEvent").mockImplementation(jest.fn())
  });

  afterAll(async () => {
    // await prismaService.workflowExecution.deleteMany();
    // await prismaService.workflowSchema.deleteMany();
    // await prismaService.workflow.deleteMany();
  });

  describe('when execution already exists ', () => {
    it('should create new workflow execution', async () => {
      const schema = {
        nodes: [
          {
            id: "0",
            type: 'transform',
            operation: "add",
            paths: ["test"],
            name: 'add 1',
            isStart: true,
            isEnd: false
          },
          {
            id: "1",
            type: 'transform',
            operation: "add",
            paths: ["test"],
            name: 'add 1',
            isStart: false,
            isEnd: true
          },

        ],
        flows: [
          { from: "0", to: "1" }
        ]
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
      const workflowExecution = await prismaService.workflowExecution.create({
        data: {
          id: workflowExecutionId,
          workflowId: workflow.id,
          workflowSchemaId: workflowSchema.id,
          status: "created"
        }
      })

      workflowExecutionEventProducer.produceStartEvent({ workflowExecutionId: workflowExecution.id })
      await setTimeout(1500, true)
      const nodeExecutions = await prismaService.nodeExecution.findMany({ where: { workflowExecutionId } })
      expect(nodeExecutions).toHaveLength(1)
      expect(producerSpy).toHaveBeenCalledWith(expect.objectContaining({
        nodeId: "0",
        nextNodeId: "1",
        status: "pending",
        isStart: true,
        isEnd: false,
        workflowExecutionId: workflowExecution.id
      }))
    });
  });
});
