import {
  // MiddlewareConsumer,
  Module,
  // NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeacherModule } from './teacher/teacher.module';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { EpisodeModule } from './episode/episode.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './file/file.module';
import { AssignmentModule } from './assignment/assignment.module';
// import WelcomeMiddleware from 'src/middlewares/welcome.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    TeacherModule,
    AdminModule,
    StudentModule,
    PrismaModule,
    CourseModule,
    LessonModule,
    EpisodeModule,
    MulterModule.register({
      dest: './uploads',
    }),
    FileModule,
    AssignmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(WelcomeMiddleware)
  //     .forRoutes({ path: '/', method: RequestMethod.GET });
  // }
}
