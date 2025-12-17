import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { randomUUID } from 'node:crypto';
import { NodeExecutionEventProducer } from 'src/infrastructure/bull/producers/node-execution.producer';
import { setTimeout } from 'node:timers/promises';

describe('Create Workflow Execution', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let workflowId: string;
  let workflowSchemaId: string;
  let workflowExecutionId: string;
  let nodeExecutionEventProducer: NodeExecutionEventProducer;
  let producerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    nodeExecutionEventProducer = moduleFixture.get(NodeExecutionEventProducer);
    prismaService = moduleFixture.get(PrismaService);
    app = moduleFixture.createNestApplication();

    await app.init();

    workflowId = randomUUID();
    workflowSchemaId = randomUUID();
    workflowExecutionId = randomUUID();
  });

  afterAll(async () => {
    await prismaService.nodeExecution.deleteMany();
    await prismaService.workflowExecution.deleteMany();
    await prismaService.workflowSchema.deleteMany();
    await prismaService.workflow.deleteMany();
    jest.resetAllMocks();
  });

  describe('when execution is already started', () => {
    it('should execute node and emit start node execution event with input', async () => {
      const schema = {
        nodes: [
          {
            id: '0',
            type: 'transform',
            operation: 'add',
            paths: ['test'],
            name: 'add 1',
            isStart: true,
            isEnd: false,
          },
          {
            id: '1',
            type: 'extract',
            source: 'node',
            paths: [{ path: 'first' }, { path: 'second', outputPath: 'new' }],
            name: 'extract',
            isStart: false,
            isEnd: false,
          },
          {
            id: '2',
            type: 'transform',
            operation: 'add',
            paths: ['test'],
            name: 'add 1',
            isStart: false,
            isEnd: true,
          },
        ],
        flows: [
          { from: '0', to: '1' },
          { from: '1', to: '2' },
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
      const workflowExecution = await prismaService.workflowExecution.create({
        data: {
          id: workflowExecutionId,
          workflowId: workflow.id,
          workflowSchemaId: workflowSchema.id,
          status: 'created',
        },
      });
      const input = {
        first: 'firstValue',
        second: 'secondValue',
        third: 'shouldBeIgnored',
      };
      const nodeExecution = await prismaService.nodeExecution.create({
        data: {
          id: randomUUID(),
          nodeId: '1',
          nextNodeId: '2',
          isStart: false,
          isEnd: false,
          workflowExecutionId: workflowExecution.id,
          status: 'pending',
        },
      });

      await nodeExecutionEventProducer.produceStartEvent({
        nodeExecution: {
          id: nodeExecution.id,
          nodeId: nodeExecution.nodeId,
          nextNodeId: nodeExecution.nextNodeId ?? undefined,
          isStart: nodeExecution.isStart,
          isEnd: nodeExecution.isEnd,
          status: 'pending',
          createdAt: nodeExecution.createdAt,
          workflowExecutionId: nodeExecution.workflowExecutionId,
        },
        input,
      });
      producerSpy = jest
        .spyOn(nodeExecutionEventProducer, 'produceStartEvent')
        .mockImplementation(jest.fn());
      await setTimeout(1500, true);
      const nodeExecutions = await prismaService.nodeExecution.findMany({
        where: { workflowExecutionId },
      });
      expect(nodeExecutions).toHaveLength(2);
      expect(nodeExecutions).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            id: nodeExecution.id,
            status: 'succeeded',
            input,
            output: {
              first: 'firstValue',
              new: 'secondValue',
            },
          }),
        ]),
      );
      expect(producerSpy).toHaveBeenCalledWith({
        nodeExecution: expect.objectContaining({
          nodeId: '2',
          status: 'pending',
          isStart: false,
          isEnd: true,
          workflowExecutionId: workflowExecution.id,
        }),
        input: {
          first: 'firstValue',
          new: 'secondValue',
        },
      });
    });
  });
});
