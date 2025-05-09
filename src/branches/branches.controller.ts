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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
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

  @ApiOkResponse({ type: BranchEntity })
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(+id);
  }
}
