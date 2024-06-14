import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Role } from '@prisma/client';
import checkOwnerAuthorization from 'src/utils/checkOwnerAuthorization';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@GetUser('id') userId: number) {
    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Get('/:id/courses')
  @UseGuards(JwtGuard)
  async getUserCourses(
    @Param('id') paramsUserId: string,
    @GetUser('id') userId: number,
    @GetUser('role') role: Role,
  ) {
    if (role === Role.STUDENT) checkOwnerAuthorization(userId, +paramsUserId);

    const courses = await this.userService.getUserEnrolledCourses(+userId);

    return courses;
  }

  @Get('/:id/assignment-submissions')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.STUDENT)
  async getUserAssignmentSubmissions(
    @Param('id') paramsUserId: string,
    @GetUser('id') userId: number,
    @GetUser('role') role: Role,
  ) {
    if (role === Role.STUDENT) checkOwnerAuthorization(userId, +paramsUserId);

    const assignmentSubmissions =
      await this.userService.getUserAssignmentSubmissions(+userId);

    return assignmentSubmissions;
  }
}
