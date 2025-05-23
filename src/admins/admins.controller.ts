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
  Delete,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AdminEntity } from './entities/admin.entity';
import { BranchesService } from 'src/branches/branches.service';
import {
  UpdateAdminDetailsDto,
  UpdateAdminPhoneDto,
} from './dto/update-admin.dto';

@ApiTags('Admins')
@ApiBearerAuth()
@Controller('admins')
@UseGuards(AuthGuard, AdminAccessGuard)
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly branchService: BranchesService,
  ) {}

  @ApiOkResponse({
    type: [AdminEntity],
    example: [
      {
        id: 2,
        phone: '346456575',
        branchId: 1,
        name: null,
        role: 'employee',
        lastName: null,
        isArchive: false,
        isActive: false,
        description: 'something about admin',
        createdAt: '2025-05-11T08:08:38.789Z',
        updatedAt: '2025-05-11T08:08:38.789Z',
      },
      {
        id: 3,
        phone: '34543534543',
        branchId: 1,
        name: null,
        role: 'admin',
        lastName: null,
        isArchive: false,
        isActive: false,
        description: 'something about admin',
        createdAt: '2025-05-11T08:08:46.853Z',
        updatedAt: '2025-05-11T08:08:46.853Z',
      },
    ],
  })
  @Roles(AdminRoleEnum.SUPERADMIN, AdminRoleEnum.ADMIN)
  @Get()
  async create(@Req() request: CustomRequest): Promise<AdminEntity[]> {
    const { role, id, branchId } = request.user;

    return await this.adminsService.getAllAdminsExceptCaller({
      adminId: id,
      role,
      branchId,
    });
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
      isActive: false,
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
    const creatorBranchId = request?.user?.branchId;

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

    if (creatorAdminRole === AdminRoleEnum.ADMIN) {
      payload.branchId = creatorBranchId;
    } else {
      const branch = await this.branchService.findOne(branchId);
      if (!branch) throw new NotFoundException('invalid branchId');
    }

    return await this.adminsService.create(payload);
  }

  @ApiParam({ name: 'adminId', type: Number })
  @ApiBody({ type: UpdateAdminDetailsDto })
  @ApiOkResponse({
    type: AdminEntity,
    example: {
      id: 11,
      phone: '346456575',
      branchId: 2,
      name: 'farzin',
      role: 'admin',
      lastName: null,
      isArchive: false,
      isActive: false,
      description: 'something about admin',
      createdAt: '2025-05-09T08:45:10.261Z',
      updatedAt: '2025-05-09T09:47:26.000Z',
    },
  })
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
    const creatorAdminRole = request?.user?.role;
    const creatorBranchId = request?.user?.branchId;
    let { branchId } = payload;
    let admin: AdminEntity;

    if (creatorAdminRole === AdminRoleEnum.SUPERADMIN) {
      admin = await this.adminsService.findOne({ adminId });
    } else {
      admin = await this.adminsService.findOne({
        adminId,
        branchId: creatorBranchId,
      });
    }
    if (!admin) throw new NotFoundException('invalid adminId');

    // prevent to change role by admin
    if (creatorAdminRole === AdminRoleEnum.ADMIN && payload.role) {
      payload.role = admin.role;
    }

    if (
      admin.role === AdminRoleEnum.SUPERADMIN ||
      payload.role === AdminRoleEnum.SUPERADMIN
    ) {
      throw new BadRequestException('update superadmin is not possible');
    }

    if (
      creatorAdminRole === AdminRoleEnum.ADMIN &&
      admin.role !== AdminRoleEnum.EMPLOYEE
    ) {
      throw new BadRequestException('you can just update employees');
    }

    if (creatorAdminRole === AdminRoleEnum.ADMIN) {
      branchId = creatorBranchId;
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

  @ApiParam({ name: 'adminId', type: Number })
  @Roles(AdminRoleEnum.SUPERADMIN, AdminRoleEnum.ADMIN)
  @Post('update-admin-phone-otp/:adminId')
  async updateAdminPhoneOtp(
    @Req() request: CustomRequest,
    @Param('adminId') adminId: number,
  ): Promise<void> {
    const { role, branchId } = request.user;
    let admin: AdminEntity;
    if (role === AdminRoleEnum.SUPERADMIN) {
      admin = await this.adminsService.findOne({ adminId });
    } else {
      admin = await this.adminsService.findOne({ adminId, branchId });
    }
    if (!admin) throw new NotFoundException('invalid adminId');

    if (role === AdminRoleEnum.ADMIN && admin.role !== AdminRoleEnum.EMPLOYEE) {
      throw new BadRequestException('you can just update employees');
    }

    //! send otp and confirm the new phone number
  }

  @ApiOkResponse({
    type: AdminEntity,
    example: {
      id: 3,
      phone: '235436543643',
      branchId: null,
      name: 'amir',
      role: 'superadmin',
      lastName: null,
      isArchive: false,
      isActive: false,
      description: null,
      createdAt: '2025-05-07T16:29:49.000Z',
      updatedAt: '2025-05-09T14:03:58.000Z',
    },
  })
  @ApiNotFoundResponse({
    example: [
      {
        message: 'invalid adminId',
        error: 'Not Found',
        statusCode: 404,
      },
    ],
  })
  @ApiBadRequestResponse({
    example: [
      {
        message: 'you can just update employees',
        error: 'Bad Request',
        statusCode: 400,
      },
      {
        message: 'invalid otp',
        error: 'Bad Request',
        statusCode: 400,
      },
    ],
  })
  @ApiParam({ name: 'adminId', type: Number })
  @ApiBody({
    type: UpdateAdminPhoneDto,
  })
  @Roles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPERADMIN)
  @Put('update-admin-phone/:adminId')
  async updateAdminPhone(
    @Req() request: CustomRequest,
    @Body() payload: UpdateAdminPhoneDto,
    @Param('adminId') adminId: number,
  ): Promise<AdminEntity> {
    const { otp, phone } = payload;
    let admin: AdminEntity;

    //!check otp with redis
    if (otp !== '12345') {
      throw new BadRequestException('invalid otp');
    }

    const { role, branchId } = request.user;
    if (role === AdminRoleEnum.SUPERADMIN) {
      admin = await this.adminsService.findOne({ adminId });
    } else {
      admin = await this.adminsService.findOne({ adminId, branchId });
    }
    if (!admin) throw new NotFoundException('invalid adminId');

    if (role === AdminRoleEnum.ADMIN && admin.role !== AdminRoleEnum.EMPLOYEE) {
      throw new BadRequestException('you can just update employees');
    }

    return await this.adminsService.updateAdminPhoneNumber({ admin, phone });
  }

  @Get('profile')
  @Roles(AdminRoleEnum.ALL_ROLES)
  async getProfile(@Req() request: CustomRequest): Promise<AdminEntity> {
    const { id } = request.user;
    const admin = await this.adminsService.findOne({ adminId: id });
    if (!admin) throw new NotFoundException('invalid adminId');

    return admin;
  }

  @ApiBody({
    type: UpdateAdminDetailsDto,
  })
  @ApiOkResponse({ type: AdminEntity })
  @Put('profile')
  @Roles(AdminRoleEnum.ALL_ROLES)
  async updateProfile(
    @Req() request: CustomRequest,
    @Body() payload: UpdateAdminDetailsDto,
  ): Promise<AdminEntity> {
    const { id } = request.user;

    const admin = await this.adminsService.findOne({ adminId: id });
    if (!admin) throw new NotFoundException('invalid adminId');

    payload.role = admin.role;
    payload.branchId = admin.branchId;

    return this.adminsService.updateAdminDetails({
      admin,
      updatedAdmin: payload,
    });
  }

  @Roles(AdminRoleEnum.ALL_ROLES)
  @Post('profile-otp')
  async profileOtp(@Req() request: CustomRequest): Promise<void> {
    const { id } = request.user;

    //! send otp and store in redis
  }

  @ApiOkResponse({ type: AdminEntity })
  @ApiBody({ type: UpdateAdminPhoneDto })
  @Roles(AdminRoleEnum.ALL_ROLES)
  @Put('profile-change-number')
  async changeProfileNumber(
    @Req() request: CustomRequest,
    @Body() payload: UpdateAdminPhoneDto,
  ): Promise<AdminEntity> {
    const { user } = request;
    const { phone, otp } = payload;
    const admin = await this.adminsService.findOne({ adminId: user.id });

    //!check otp from redis
    if (otp !== '12345') throw new BadRequestException('invalid otp');

    return await this.adminsService.updateAdminPhoneNumber({
      admin,
      phone,
    });
  }

  @ApiParam({ name: 'adminId', type: Number })
  @Roles(AdminRoleEnum.SUPERADMIN, AdminRoleEnum.ADMIN)
  @Delete(':adminId')
  async deleteAdmin(
    @Req() request: CustomRequest,
    @Param('adminId') adminId: number,
  ): Promise<AdminEntity> {
    const { role, branchId } = request.user;
    let admin: AdminEntity;

    if (role === AdminRoleEnum.SUPERADMIN) {
      admin = await this.adminsService.findOne({ adminId });
    } else {
      admin = await this.adminsService.findOne({ adminId, branchId });
    }

    if (!admin) throw new NotFoundException('invalid adminId');
    if (role === AdminRoleEnum.ADMIN && admin.role !== AdminRoleEnum.EMPLOYEE) {
      throw new BadRequestException('you can just delete employees');
    }
    return await this.adminsService.archiveAdmin(admin);
  }
}
