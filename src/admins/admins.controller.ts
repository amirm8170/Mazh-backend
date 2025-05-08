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
  BadRequestException,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { AdminAccessGuard, Roles } from 'src/auth/guards/admin-access.guard';
import { AdminTypeEnum } from './enum/admin-type.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminEntity } from './entities/admin.entity';

@ApiTags('Admins')
@ApiBearerAuth()
@Controller('admins')
@UseGuards(AuthGuard, AdminAccessGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Roles(AdminTypeEnum.SUPERADMIN)
  @Get()
  create(@Req() request: Request) {
    return request['user'];
  }

  @ApiOkResponse({
    type: AdminEntity,
    example: {
      phone: '09124323435',
      type: 'employee',
      name: null,
      lastName: null,
      id: 5,
      isArchive: false,
      createdAt: '2025-05-08T16:21:06.730Z',
      updatedAt: '2025-05-08T16:21:06.730Z',
    },
  })
  @ApiBadRequestResponse({
    example: [
      {
        message: 'admin with phone 09124323435 already exists',
        error: 'Bad Request',
        statusCode: 400,
      },
      {
        message: 'admin is not allowed to create admin',
        error: 'Bad Request',
        statusCode: 400,
      },
      {
        message: 'admin type just could be employee or admin',
        error: 'Bad Request',
        statusCode: 400,
      },
    ],
  })
  @ApiBody({
    type: CreateAdminDto,
  })
  @Roles(AdminTypeEnum.SUPERADMIN, AdminTypeEnum.ADMIN)
  @Post('add-admin')
  async createAdmin(
    @Req() request: Request,
    @Body() payload: CreateAdminDto,
  ): Promise<AdminEntity> {
    const { phone, type } = payload;
    const creatorAdminType = request['user']['type'];
    const admin = await this.adminsService.findByPhone(phone);

    if (admin)
      throw new BadRequestException(`admin with phone ${phone} already exists`);
    if (type === AdminTypeEnum.SUPERADMIN || type === AdminTypeEnum.ALL_ROLES) {
      throw new BadRequestException(
        `admin type just could be ${AdminTypeEnum.EMPLOYEE} or ${AdminTypeEnum.ADMIN}`,
      );
    }
    if (
      creatorAdminType !== AdminTypeEnum.SUPERADMIN &&
      type === AdminTypeEnum.ADMIN
    ) {
      throw new BadRequestException(
        `${creatorAdminType} is not allowed to create ${type}`,
      );
    }
    return await this.adminsService.create(payload);
  }
}
