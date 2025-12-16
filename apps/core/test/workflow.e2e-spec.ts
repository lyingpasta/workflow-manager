import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get(PrismaService);
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await prismaService.workflowSchema.deleteMany();
    await prismaService.workflow.deleteMany();
  });

  it('should create new workflow with its schema', async () => {
    await request(app.getHttpServer())
      .post('/workflow')
      .send({
        workflow: {
          name: 'test name',
          isActive: false,
        },
        schema: {
          schema: { test: 'value' },
          isActive: true,
        },
      })
      .expect(201);

    const maybeWorkflow = await prismaService.workflow.findMany();
    expect(maybeWorkflow).not.toHaveLength(0);
    expect(maybeWorkflow).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'test name',
          isActive: false,
        }),
      ]),
    );
    const maybeSchema = await prismaService.workflowSchema.findMany();
    expect(maybeSchema).not.toHaveLength(0);
    expect(maybeSchema).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          schema: { test: 'value' },
          isActive: true,
        }),
      ]),
    );
  });
});
