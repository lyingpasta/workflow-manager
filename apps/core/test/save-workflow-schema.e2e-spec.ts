import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Save workflow schema', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let workflowId: string;
  let workflowSchemaId: string;
  let workflowExecutionId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
  });

  describe('when schema exists', () => {
    describe('when no execution exists yet', () => {
      it('should save the new schema', async () => {
        const workflow = await prismaService.workflow.create({
          data: {
            id: workflowId,
            name: 'test workflow',
          },
        });

        const workflowSchema = await prismaService.workflowSchema.create({
          data: {
            id: workflowSchemaId,
            workflowId: workflow.id,
            schema: {},
            isActive: true,
          },
        });
        await request(app.getHttpServer())
          .patch('/schemas')
          .send({
            schema: { test: 'value' },
            id: workflowSchema.id,
          })
          .expect(200);

        const updatedSchema =
          await prismaService.workflowSchema.findUniqueOrThrow({
            where: { id: workflowSchemaId },
          });
        expect(updatedSchema).toMatchObject(
          expect.objectContaining({
            schema: { test: 'value' },
          }),
        );
      });
    });

    describe('when already execution exists', () => {
      it('should create a new schema', async () => {
        const workflow = await prismaService.workflow.create({
          data: {
            id: workflowId,
            name: 'test workflow',
          },
        });

        const workflowSchema = await prismaService.workflowSchema.create({
          data: {
            id: workflowSchemaId,
            workflowId: workflow.id,
            schema: {},
            isActive: true,
          },
        });

        await prismaService.workflowExecution.create({
          data: {
            id: randomUUID(),
            workflowId: workflow.id,
            workflowSchemaId: workflowSchema.id,
          },
        });

        await request(app.getHttpServer())
          .patch('/schemas')
          .send({
            schema: { test: 'updated', then: 'new' },
            id: workflowSchema.id,
          })
          .expect(200);

        const existingSchemas = await prismaService.workflowSchema.findMany({
          where: { workflowId: workflow.id },
        });
        expect(existingSchemas).toHaveLength(2);
        expect(existingSchemas).toMatchObject(
          expect.arrayContaining([
            expect.objectContaining({
              schema: expect.objectContaining({ test: 'value' }),
              isActive: false,
            }),
            // expect.objectContaining({
            //   schema: expect.objectContaining({ test: 'value', then: "new" }),
            //   isActive: true
            // })
          ]),
        );
      });
    });
  });
});
