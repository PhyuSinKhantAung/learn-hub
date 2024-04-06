import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';

@Controller('files')
export class FileController {
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:filePathname')
  getUplodedFile(@Param('filePathname') file, @Res() res) {
    return res.sendFile(file, { root: './uploads' });
  }
}
