import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminAccessGuard, Roles } from 'src/auth/guards/admin-access.guard';
import { AdminRoleEnum } from 'src/admins/enum/admin-type.enum';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminAccessGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @ApiOkResponse({
    type: BranchEntity,
    example: {
      name: 'second branch',
      address: 'address',
      phone: '464564353',
      description: 'description second',
      id: 2,
      isArchive: false,
      createdAt: '2025-05-09T08:56:25.303Z',
      updatedAt: '2025-05-09T08:56:25.303Z',
    },
  })
  @ApiBody({ type: CreateBranchDto })
  @Roles(AdminRoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    return this.branchesService.create(createBranchDto);
  }

  @ApiOkResponse({
    type: [BranchEntity],
    example: [
      {
        id: 1,
        name: 'first branch',
        address: 'address',
        phone: '04564564654',
        description: 'description',
        isArchive: false,
        createdAt: '2025-05-09T06:25:40.407Z',
        updatedAt: '2025-05-09T06:25:40.407Z',
        admins: [],
      },
      {
        id: 2,
        name: 'second branch',
        address: 'address',
        phone: '464564353',
        description: 'description second',
        isArchive: false,
        createdAt: '2025-05-09T08:56:25.303Z',
        updatedAt: '2025-05-09T08:56:25.303Z',
        admins: [
          {
            id: 11,
            phone: '346456575',
            branchId: 2,
            name: 'farzin',
            role: 'admin',
            lastName: null,
            isArchive: false,
            description: 'something about admin',
            createdAt: '2025-05-09T08:45:10.261Z',
            updatedAt: '2025-05-09T10:00:54.000Z',
          },
        ],
      },
    ],
  })
  @Roles(AdminRoleEnum.SUPERADMIN)
  @Get()
  findAll(): Promise<BranchEntity[]> {
    return this.branchesService.findAll();
  }

  @Roles(AdminRoleEnum.SUPERADMIN)
  @ApiParam({ name: 'branchId', type: Number })
  @ApiNotFoundResponse({
    example: {
      message: 'invalid branchId',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @Get(':branchId')
  async findOne(@Param('branchId') branchId: number): Promise<BranchEntity> {
    const branch = await this.branchesService.findOne(branchId);
    if (!branch) throw new NotFoundException('invalid branchId');

    return branch;
  }

  @Roles(AdminRoleEnum.SUPERADMIN)
  @ApiParam({ name: 'branchId', type: Number })
  @ApiBody({ type: UpdateBranchDto })
  @ApiNotFoundResponse({
    example: {
      message: 'invalid branchId',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiOkResponse({
    type: BranchEntity,
    example: {
      id: 1,
      name: 'updated name',
      address: 'address',
      phone: '04564564654',
      description: 'description',
      isArchive: false,
      createdAt: '2025-05-09T06:25:40.407Z',
      updatedAt: '2025-05-09T15:13:28.000Z',
    },
  })
  @Put(':branchId')
  async update(
    @Param('branchId') branchId: number,
    @Body() payload: UpdateBranchDto,
  ): Promise<BranchEntity> {
    const branch = await this.branchesService.findOne(branchId);

    if (!branch) throw new NotFoundException('invalid branchId');

    return await this.branchesService.update({
      branchId,
      updatedBranch: payload,
    });
  }

  @Roles(AdminRoleEnum.SUPERADMIN)
  @ApiParam({ name: 'branchId', type: Number })
  @ApiNotFoundResponse({ example: [] })
  @Delete(':branchId')
  async remove(@Param('branchId') branchId: number): Promise<void> {
    const branch = await this.branchesService.findOne(branchId);

    if (!branch) throw new NotFoundException('invalid branchId');

    await this.branchesService.archive(branchId);

    return;
  }
}
