import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';

@Controller('admins')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/superadmin')
  @HttpCode(HttpStatus.CREATED)
  async createSuperAdmin(@Body() dto: CreateAdminDto) {
    console.log('here logged');
    const admin = await this.adminService.createAdmin(dto, Role.SUPERADMIN);
    console.log({ admin });
    return admin;
  }

  @Roles(Role.SUPERADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() dto: CreateAdminDto) {
    return await this.adminService.createAdmin(dto);
  }
}
