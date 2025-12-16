import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { randomUUID } from 'node:crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService
  let workflowId: string
  let workflowSchemaId: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get(PrismaService)
    app = moduleFixture.createNestApplication();

    await app.init();

    workflowId = randomUUID()
    workflowSchemaId = randomUUID()
  });

  afterAll(async () => {
    await prismaService.workflowExecution.deleteMany()
    await prismaService.workflowSchema.deleteMany()
    await prismaService.workflow.deleteMany()
  })

  describe("when active workflow and active workflow schema exists ", () => {
    it('should create new workflow execution', async () => {
      const schema = {
        nodes: [
          {
            type: "transform",
            name: "add 1",
            operation: "$output=$input.value+1"
          }
        ]
      }
      const workflow = await prismaService.workflow.create({
        data: {
          id: workflowId,
          name: "test",
          isActive: true
        }
      })
      const workflowSchema = await prismaService.workflowSchema.create({
        data: {
          id: workflowSchemaId,
          schema,
          isActive: true,
          workflowId: workflowId
        }
      })
      await request(app.getHttpServer())
        .post(`/executions/${workflow.id}/start`)
        .expect(201)

      const maybeWorkflowExecution = await prismaService.workflowExecution.findMany({
        where: {
          workflowId: workflow.id
        }
      })
      expect(maybeWorkflowExecution).toHaveLength(1)
      expect(maybeWorkflowExecution).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            status: "created",
            workflowId: workflow.id,
            workflowSchemaId: workflowSchema.id
          })
        ]))
    });
  })
});
