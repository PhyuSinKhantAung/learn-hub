import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeacherModule } from './teacher/teacher.module';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [UserModule, AuthModule, TeacherModule, AdminModule, StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
