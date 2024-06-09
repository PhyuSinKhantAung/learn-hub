import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
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

    prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close;
  });

  describe('Super Admin', () => {
    const dto = {
      name: 'Test Super Admin',
      email: 'testsuperadmin@gmail.com',
      password: 'testsuperadmin123456',
    };

    it('create superadmin without authentication.', () => {
      return pactum
        .spec()
        .post('/admins/superadmin')
        .withBody(dto)
        .expectStatus(201);
    });

    it('should get credentials taken error with used super admin email ', () => {
      return pactum
        .spec()
        .post('/admins/superadmin')
        .withBody(dto)
        .expectStatus(403);
    });

    it('create another superadmin without authentication.', () => {
      return pactum
        .spec()
        .post('/admins/superadmin')
        .withBody({
          name: 'Second Super Admin Testing',
          email: 'secondsuperadmin@gmail.com',
          password: 'secondsuperadmin123456',
        })
        .expectStatus(201);
    });

    it('should signin as superadmin', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('superAdminToken', 'accessToken');
    });
  });

  describe('Admin', () => {
    const dto = {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123456',
    };

    it('should get unauthorized error while creating admin with admin token', () => {
      return pactum
        .spec()
        .post('/admins')
        .withBody(dto)
        .withBearerToken('$S{adminToken}')
        .expectStatus(401);
    });

    it('create admin with superadmin token', () => {
      return pactum
        .spec()
        .post('/admins')
        .withBody(dto)
        .withBearerToken('$S{superAdminToken}')
        .expectStatus(201);
    });

    it('should signin as admin', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('adminToken', 'accessToken');
    });
  });

  describe('Teacher', () => {
    const dto = {
      name: 'Teacher Testing',
      email: 'teachertesting@gmail.com',
      password: 'teachertesting123456',
    };

    it('should get unauthenticated error', () => {
      return pactum.spec().post('/teachers').withBody(dto).expectStatus(401);
    });

    it('create teacher with admin token', () => {
      return pactum
        .spec()
        .post('/teachers')
        .withBody(dto)
        .expectStatus(201)
        .withBearerToken('$S{adminToken}');
    });

    it('should signin as teacher', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('teacherToken', 'accessToken');
    });

    it('should get unauthorized error with teacher token while creating teacher', () => {
      return pactum
        .spec()
        .post('/teachers')
        .withBody(dto)
        .expectStatus(403)
        .withBearerToken('$S{teacherToken}');
    });
  });

  describe('Auth', () => {
    describe('Credentials', () => {
      const dto = {
        name: 'Testing Student',
        email: 'testingstudent@gmail.com',
        password: 'teststudent123456',
      };

      it('should get not found error while signing in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(404);
      });

      it('sign up as student', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .stores('studentToken', 'accessToken');
      });

      it('sign in as student', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200);
      });

      it('should get credentials wrong error while signing in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: 'wrongpassword',
          })
          .expectBodyContains({
            message: 'Credentials incorrect',
            error: 'Forbidden',
            statusCode: 403,
          })
          .expectStatus(403);
      });
    });

    describe('Google', () => {
      it('google signin', () => {
        return pactum.spec().get('/auth/google-signin').expectStatus(302);
      });

      it('google redirect', () => {
        return pactum.spec().get('/auth/google-redirect').expectStatus(302);
      });
    });
  });
});
