import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
  Put,
  Param,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import {
  AdminAccessGuard,
  CustomRequest,
  Roles,
} from 'src/auth/guards/admin-access.guard';
import { AdminRoleEnum } from './enum/admin-type.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminEntity } from './entities/admin.entity';
import { BranchesService } from 'src/branches/branches.service';
import { UpdateAdminDetailsDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@ApiBearerAuth()
@Controller('admins')
@UseGuards(AuthGuard, AdminAccessGuard)
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly branchService: BranchesService,
  ) {}

  @Roles(AdminRoleEnum.SUPERADMIN)
  @Get()
  create(@Req() request: Request) {
    return request['user'];
  }

  /**
   * Creates admin user (superadmin can create admins/employees, admin can only create employees)
   * @param request
   * @param payload
   * @returns A promise that resolves created used by admin or superadmin
   */
  @ApiOkResponse({
    type: AdminEntity,
    example: {
      phone: '09124323435',
      role: 'employee',
      name: null,
      lastName: null,
      id: 5,
      branchId: 1,
      description: 'something about admin',
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
        message: 'admin role just could be employee or admin',
        error: 'Bad Request',
        statusCode: 400,
      },
    ],
  })
  @ApiBody({
    type: CreateAdminDto,
  })
  @Roles(AdminRoleEnum.SUPERADMIN, AdminRoleEnum.ADMIN)
  @Post('add-admin')
  async createAdmin(
    @Req() request: CustomRequest,
    @Body() payload: CreateAdminDto,
  ): Promise<AdminEntity> {
    const { phone, role, branchId } = payload;
    const creatorAdminRole = request?.user?.role;

    const admin = await this.adminsService.findByPhone(phone);

    if (admin)
      throw new BadRequestException(`admin with phone ${phone} already exists`);
    if (role === AdminRoleEnum.SUPERADMIN || role === AdminRoleEnum.ALL_ROLES) {
      throw new BadRequestException(
        `admin type just could be ${AdminRoleEnum.EMPLOYEE} or ${AdminRoleEnum.ADMIN}`,
      );
    }
    if (
      creatorAdminRole !== AdminRoleEnum.SUPERADMIN &&
      role === AdminRoleEnum.ADMIN
    ) {
      throw new BadRequestException(
        `${creatorAdminRole} is not allowed to create ${role}`,
      );
    }
    const branch = await this.branchService.findOne(branchId);
    if (!branch) throw new NotFoundException('invalid branchId');

    return await this.adminsService.create(payload);
  }

  @ApiExtraModels(CreateAdminDto)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiBody({ type: UpdateAdminDetailsDto })
  @ApiOkResponse({ type: AdminEntity })
  @ApiBadRequestResponse({
    example: [
      {
        message: 'update superadmin is not possible',
        error: 'Bad Request',
        statusCode: 400,
      },
      {
        message: 'you can just update employees',
        error: 'Bad Request',
        statusCode: 400,
      },
    ],
  })
  @ApiNotFoundResponse({
    example: [
      {
        message: 'invalid adminId',
        error: 'Not Found',
        statusCode: 404,
      },
      {
        message: 'invalid branch id',
        error: 'Not Found',
        statusCode: 404,
      },
    ],
  })
  @Roles(AdminRoleEnum.SUPERADMIN, AdminRoleEnum.ADMIN)
  @Put('update-admin-details/:adminId')
  async updateAdmin(
    @Req() request: CustomRequest,
    @Body() payload: UpdateAdminDetailsDto,
    @Param('adminId') adminId: number,
  ): Promise<AdminEntity> {
    const { role } = request.user;
    const { branchId } = payload;

    const admin = await this.adminsService.findOne(adminId);
    if (!admin) throw new NotFoundException('invalid adminId');

    // prevent to change role by admin
    if (role === AdminRoleEnum.ADMIN && payload.role) {
      payload.role = admin.role;
    }

    if (
      admin.role === AdminRoleEnum.SUPERADMIN ||
      payload.role === AdminRoleEnum.SUPERADMIN
    ) {
      throw new BadRequestException('update superadmin is not possible');
    }

    if (role === AdminRoleEnum.ADMIN && admin.role !== AdminRoleEnum.EMPLOYEE) {
      throw new BadRequestException('you can just update employees');
    }

    if (branchId) {
      const branch = await this.branchService.findOne(branchId);
      if (!branch) throw new NotFoundException('invalid branch id');
    }

    return await this.adminsService.updateAdminDetails({
      admin,
      updatedAdmin: payload,
    });
  }
}
