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

      it('sign up as second student', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            name: 'Testing Student Second',
            email: 'testingstudentsecond@gmail.com',
            password: 'testingstudentsecond123456',
          })
          .expectStatus(201)
          .stores('secondStudentToken', 'accessToken');
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

  describe('Course', () => {
    describe('Creating Course', () => {
      const dto = {
        name: 'English Testing Course',
        description: 'This is testing description course details',
      };

      it('should get unauthenticated error', () => {
        return pactum.spec().post('/courses').withBody(dto).expectStatus(401);
      });

      it('should get unauthorized error while creating course witha admin/superadmin token', () => {
        return pactum
          .spec()
          .post('/courses')
          .withBody(dto)
          .expectStatus(403)
          .withBearerToken('$S{adminToken}');
      });

      it('create course by teacher token', () => {
        return pactum
          .spec()
          .post('/courses')
          .withBody(dto)
          .expectStatus(201)
          .withBearerToken('$S{teacherToken}')
          .stores('courseId', 'id');
      });

      it('create second course by teacher token', () => {
        return pactum
          .spec()
          .post('/courses')
          .withBody({
            name: 'Second course to delete',
            description: 'Test descripion',
          })
          .expectStatus(201)
          .withBearerToken('$S{teacherToken}')
          .stores('secondCourseId', 'id');
      });
    });

    describe('Getting Course', () => {
      it('should get all courses without token', () => {
        return pactum.spec().get('/courses').expectStatus(200);
      });

      it('should get all courses with student token', () => {
        return pactum
          .spec()
          .get('/courses')
          .withBearerToken('$S{studentToken}')
          .expectStatus(200);
      });

      it('should get all courses with admin token', () => {
        return pactum
          .spec()
          .get('/courses')
          .withBearerToken('$S{adminToken}')
          .expectStatus(200);
      });

      it('should get all courses with teacher token', () => {
        return pactum
          .spec()
          .get('/courses')
          .withBearerToken('$S{teacherToken}')
          .expectStatus(200);
      });

      it('should get course by id without token', () => {
        return pactum.spec().get('/courses/$S{courseId}').expectStatus(200);
      });
    });

    describe('Updating Course', () => {
      const dto = {
        name: 'Edited course name',
      };
      it('should get unauthorized error without any token', () => {
        return pactum
          .spec()
          .patch('/courses/$S{courseId}')
          .withBody(dto)
          .expectStatus(401);
      });

      it('should get unauthorized error without teacher token', () => {
        return pactum
          .spec()
          .patch('/courses/$S{courseId}')
          .withBody(dto)
          .expectStatus(403)
          .withBearerToken('$S{studentToken}');
      });

      it('update course with teacher token', () => {
        return pactum
          .spec()
          .patch('/courses/$S{courseId}')
          .withBody(dto)
          .expectStatus(200)
          .withBearerToken('$S{teacherToken}');
      });
    });

    describe('Enrolling Course', () => {
      it('should get unauthorized error without student token', () => {
        return pactum
          .spec()
          .post('/courses/$S{courseId}/courseEnrollments')
          .withBearerToken('$S{adminToken}')
          .expectStatus(403);
      });

      it('enroll course with student token', () => {
        return pactum
          .spec()
          .post('/courses/$S{courseId}/courseEnrollments')
          .withBearerToken('$S{studentToken}')
          .expectStatus(201);
      });

      it('enroll course as second student', () => {
        return pactum
          .spec()
          .post('/courses/$S{courseId}/courseEnrollments')
          .withBearerToken('$S{secondStudentToken}')
          .expectStatus(201);
      });

      it('should get course not found error', () => {
        return pactum
          .spec()
          .post('/courses/1000/courseEnrollments')
          .withBearerToken('$S{studentToken}')
          .expectStatus(404);
      });

      it('get all enrolled courses with only admin/superadmin token', () => {
        return pactum
          .spec()
          .get('/courses/allCourseEnrollments')
          .withBearerToken('$S{adminToken}')
          .expectStatus(200);
      });

      it('should get unauthorized error when access all enrolled courses without admin/superadmin token', () => {
        return pactum
          .spec()
          .get('/courses/allCourseEnrollments')
          .withBearerToken('$S{studentToken}')
          .expectStatus(403);
      });

      it(`get own enrolled courses with only own token`, () => {
        return pactum
          .spec()
          .get('/courses/courseEnrollments')
          .withBearerToken('$S{studentToken}')
          .expectStatus(200);
      });

      it(`should get unauthorized error when access the user's enrolled courses`, () => {
        return pactum
          .spec()
          .get('/courses/courseEnrollments')
          .withBearerToken('$S{adminToken}')
          .expectStatus(403);
      });
    });

    describe('Deleting Course', () => {
      it('should get unauthorized error with teacher token', () => {
        return pactum
          .spec()
          .delete('/courses/$S{courseId}')
          .withBearerToken('$S{teacherToken}')
          .expectStatus(403);
      });

      it('delete course with admin token', () => {
        return pactum
          .spec()
          .delete('/courses/$S{secondCourseId}')
          .withBearerToken('$S{adminToken}')
          .expectStatus(200);
      });

      it('should get course not found error when deleting non-exist course with superadmin token', () => {
        return pactum
          .spec()
          .delete('/courses/10000')
          .withBearerToken('$S{adminToken}')
          .expectStatus(404);
      });
    });

    describe('Lesson', () => {
      describe('Creating Lesson', () => {
        const dto = {
          title: 'Speaking Lesson',
          description: 'Hello World',
          courseId: '$S{courseId}',
        };

        it('should get unauthorized error without teacher token', () => {
          return pactum
            .spec()
            .post('/lessons')
            .withBody(dto)
            .withBearerToken('$S{studentToken}')
            .expectStatus(403);
        });

        it('create lesson with only teacher token', () => {
          return (
            pactum
              .spec()
              .post('/lessons')
              .withBody(dto)
              .withBearerToken('$S{teacherToken}')
              .stores('lessonId', 'id')
              // .inspect()
              .expectStatus(201)
          );
        });

        it('create second lesson with only teacher token', () => {
          return (
            pactum
              .spec()
              .post('/lessons')
              .withBody(dto)
              .withBearerToken('$S{teacherToken}')
              .stores('secondLessonId', 'id')
              // .inspect()
              .expectStatus(201)
          );
        });
      });

      describe('Get Lessons', () => {
        it('should get unauthenticated error without auth header', () => {
          return pactum
            .spec()
            .get('/lessons')
            .withQueryParams('courseId', '$S{courseId}')
            .expectStatus(401);
        });

        it('get lessons by course id with teacher token', () => {
          return pactum
            .spec()
            .get('/lessons')
            .withQueryParams('courseId', '$S{courseId}')
            .withBearerToken('$S{teacherToken}')
            .expectStatus(200);
        });

        it('get lessons by course id with student token', () => {
          return pactum
            .spec()
            .get('/lessons')
            .withQueryParams('courseId', '$S{courseId}')
            .withBearerToken('$S{studentToken}')
            .expectStatus(200);
        });

        it('get lessons by course id with admin token', () => {
          return pactum
            .spec()
            .get('/lessons')
            .withBearerToken('$S{adminToken}')
            .withQueryParams('courseId', '$S{courseId}')
            .expectStatus(200);
        });

        it('should get data empty array as lessons when accessing with non-exist course id', () => {
          return pactum
            .spec()
            .get('/lessons')
            .withQueryParams('courseId', '1000')
            .withBearerToken('$S{studentToken}')
            .expectBodyContains({
              data: [],
              count: 0,
            })
            .expectStatus(200);
        });
      });

      describe('Update Lesson', () => {
        it('should get unauthorized error when update lesson with student token', () => {
          return pactum
            .spec()
            .patch('/lessons/$S{lessonId}')
            .withBearerToken('$S{studentToken}')
            .expectStatus(403);
        });

        it('update lesson by teacher token', () => {
          return (
            pactum
              .spec()
              .patch('/lessons/$S{lessonId}')
              .withBearerToken('$S{teacherToken}')
              // .inspect()
              .expectStatus(200)
          );
        });
      });
    });

    describe('Episode', () => {
      describe('Create episode', () => {
        const dto = {
          title: 'Episode 1',
          lessonId: String('$S{lessonId}'),
          resources: [
            'https://example.com', //resource link as an example
          ],
        };

        it('create episode for each lesson', () => {
          return (
            pactum
              .spec()
              .post('/episodes')
              .withBody(dto)
              .withBearerToken('$S{teacherToken}')
              .expectStatus(201)
              // .inspect()
              .stores('episodeId', 'id')
          );
        });

        it('create second episode for each lesson', () => {
          return pactum
            .spec()
            .post('/episodes')
            .withBody({ ...dto, lessonId: '$S{secondLessonId}' })
            .withBearerToken('$S{teacherToken}')
            .expectStatus(201);
          // .inspect();
        });

        it('should get unauthorized error when creating episode without teacher token', () => {
          return pactum
            .spec()
            .post('/episodes')
            .withBody(dto)
            .withBearerToken('$S{studentToken}')
            .expectStatus(403);
        });
      });

      describe('Getting Episodes', () => {
        it('should get bad request error without lesson id', () => {
          return pactum
            .spec()
            .get('/episodes')
            .withBearerToken('$S{studentToken}')
            .expectStatus(400);
        });

        it('get episodes with auth header using lesson id query', () => {
          return (
            pactum
              .spec()
              .get('/episodes')
              .withQueryParams('lessonId', '$S{lessonId}')
              .withBearerToken('$S{studentToken}')
              .expectStatus(200)
              // .inspect()
              .expectJsonLike({ data: [{}], count: 1 })
          );
        });
      });
    });

    describe('Assignment', () => {
      describe('Create assignment', () => {
        const dto = {
          episodeId: '$S{episodeId}',
          title: 'Hello World',
          description: 'Testing World',
        };

        it('should get unauthenticated error', () => {
          return pactum.spec().post('/assignments').expectStatus(401);
        });

        it('should get bad request error', () => {
          return pactum
            .spec()
            .post('/assignments')
            .withBearerToken('$S{teacherToken}')
            .expectStatus(400);
        });

        it('create assignment with episode id using only teacher token', () => {
          return pactum
            .spec()
            .post('/assignments')
            .withBearerToken('$S{teacherToken}')
            .withBody(dto)
            .stores('assignmentId', 'id')
            .expectStatus(201);
        });

        it('should get unauthorized error', () => {
          return pactum
            .spec()
            .post('/assignments')
            .withBearerToken('$S{studentToken}')
            .withBody(dto)
            .expectStatus(403);
        });
      });

      describe('Create assignment submission', () => {
        const dto = {
          assignmentParagraph:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        };

        it('should get unauthenticated error', () => {
          return pactum
            .spec()
            .post('/assignments/$S{assignmentId}/submissions')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should get unauthorized error', () => {
          return pactum
            .spec()
            .post('/assignments/$S{assignmentId}/submissions')
            .withBody(dto)
            .withBearerToken('$S{adminToken}')
            .expectStatus(403);
        });

        it('make assignment submission with assignment id using student token ', () => {
          return pactum
            .spec()
            .post('/assignments/$S{assignmentId}/submissions')
            .withBody(dto)
            .withBearerToken('$S{studentToken}')
            .stores('submissionId', 'id')
            .expectStatus(201);
        });
      });

      describe('Getting assigment submissions', () => {
        it('getting assignment submissions by assignment id', () => {
          return pactum
            .spec()
            .get('/assignments/$S{assignmentId}/submissions')
            .withBearerToken('$S{teacherToken}')
            .expectStatus(200)
            .expectJsonLike({
              data: [{}],
              count: 1,
            });
        });
      });

      describe('Update assignment submission', () => {
        const dto = {
          assignmentParagraph: 'edited assinment submission edited',
        };

        it('update assignment submission with id using its owner student token', () => {
          return pactum
            .spec()
            .patch('/assignments/$S{assignmentId}/submissions/$S{submissionId}')
            .withBody(dto)
            .withBearerToken('$S{studentToken}')
            .expectStatus(200)
            .inspect();
        });

        it('should get unauthorized error without owner student token', () => {
          return pactum
            .spec()
            .patch('/assignments/$S{assignmentId}/submissions/$S{submissionId}')
            .withBody(dto)
            .withBearerToken('$S{secondStudentToken}')
            .expectStatus(401)
            .inspect();
        });

        describe('Grading assignments', () => {
          const dto = {
            result: 50,
            isChecked: true,
            submissionId: '$S{submissionId}',
          };

          it('grade assignment submission with only teacher token', () => {
            return pactum
              .spec()
              .patch('/assignments/$S{assignmentId}/grades')
              .withBearerToken('$S{teacherToken}')
              .withBody(dto)
              .expectStatus(200);
          });

          it('should get unauthorized error when give the grades without teacher token', () => {
            return pactum
              .spec()
              .patch('/assignments/$S{assignmentId}/grades')
              .withBearerToken('$S{studentToken}')
              .withBody(dto)
              .expectStatus(403);
          });
        });
      });
    });
  });
});
