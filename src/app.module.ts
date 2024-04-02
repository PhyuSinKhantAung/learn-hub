import { Module } from '@nestjs/common';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
