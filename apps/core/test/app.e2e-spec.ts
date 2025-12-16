import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get(PrismaService)
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('create new workflow', async () => {
    await request(app.getHttpServer())
      .post('/workflow')
      .send({
        workflow: {
          name: "test name",
          isActive: false
        },
        schema: {
          schema: { "test": "value" },
          isActive: true,
        }
      })
      .expect(200)

    const maybeWorkflow = await prismaService.workflow.findMany()
    expect(maybeWorkflow).not.toHaveLength(1)
    expect(maybeWorkflow).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          name: "test name",
          isActive: false
        })
      ]))
    const maybeSchema = await prismaService.workflowSchema.findMany()
    expect(maybeSchema).not.toHaveLength(0)
    expect(maybeSchema).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          schema: { "test": "value" },
          isActive: true,
        })
      ]))
  });
});
