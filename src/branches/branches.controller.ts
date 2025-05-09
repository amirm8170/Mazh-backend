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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminAccessGuard, Roles } from 'src/auth/guards/admin-access.guard';
import { AdminRoleEnum } from 'src/admins/enum/admin-type.enum';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminAccessGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Roles(AdminRoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    return this.branchesService.create(createBranchDto);
  }

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
