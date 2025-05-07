import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { AdminAccessGuard, Roles } from 'src/auth/guards/admin-access.guard';
import { AdminTypeEnum } from './enum/admin-type.enum';

@Controller('admins')
@UseGuards(AuthGuard, AdminAccessGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @Roles(AdminTypeEnum.EMPLOYEE)
  create(@Req() request: Request) {
    return request['user'];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
