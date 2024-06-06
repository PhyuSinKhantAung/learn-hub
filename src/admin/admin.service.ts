import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  async createAdmin(dto: CreateAdminDto, role: Role = Role.ADMIN) {
    try {
      const admin = await this.userService.createUser({ ...dto, role });
      console.log({ admin });
      return { message: 'success ' };
    } catch (error) {
      console.log('causing error?', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
