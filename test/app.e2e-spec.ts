import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen('3333');

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close;
  });

  // describe('Welcome API', () => {
  //   it('/ (GET)', () => {
  //     return pactum
  //       .spec()
  //       .get('/')
  //       .expectStatus(200)
  //       .expectBody('Welcome from Learn-Hub API');
  //   });
  // });

  describe('Admin module', () => {
    describe('Superadmin Role', () => {
      const body = {
        name: 'Test Super Admin',
        email: 'testsuperadmin@gmail.com',
        password: 'testsuperadmin123456',
      };

      it('Create superadmin without authentication.', () => {
        return pactum
          .spec()
          .post('/admins/superadmin')
          .withBody({
            id: 1,
            ...body,
          })
          .expectStatus(201);
      });

      it('Should get credentials taken error', () => {
        return pactum
          .spec()
          .post('/admins/superadmin')
          .withBody(body)
          .expectStatus(403);
      });
    });

    describe('Auth', () => {
      it('Sign in', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: 'testsuperadmin@gmail.com',
            password: 'testsuperadmin123456',
          })
          .expectStatus(200)
          .inspect()
          .stores('superAdminToken', 'accessToken');
      });
    });

    describe('Admin role', () => {
      const body = {
        email: 'admin@gmail.com',
        password: 'admin123456',
      };
      it('Create admin', () => {
        return pactum
          .spec()
          .post('/admins')
          .withBody(body)
          .withBearerToken('$S{superAdminToken}')
          .expectStatus(201);
      });
    });
  });
});
