import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
  async createSuperAdmin(@Body() dto: CreateAdminDto) {
    return await this.adminService.createAdmin(dto, Role.SUPERADMIN);
  }

  @Roles(Role.SUPERADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createAdmin(@Body() dto: CreateAdminDto) {
    return await this.adminService.createAdmin(dto);
  }
}
