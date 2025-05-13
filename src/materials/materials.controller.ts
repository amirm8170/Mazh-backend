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
  NotFoundException,
  Put,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  AdminAccessGuard,
  CustomRequest,
  Roles,
} from 'src/auth/guards/admin-access.guard';
import { AdminRoleEnum } from 'src/admins/enum/admin-type.enum';
import { MaterialEntity } from './entities/material.entity';

@ApiTags('materials')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminAccessGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @ApiOkResponse({ type: MaterialEntity })
  @ApiBody({ type: CreateMaterialDto })
  @Roles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPERADMIN)
  @Post()
  async create(
    @Req() request: CustomRequest,
    @Body() payload: CreateMaterialDto,
  ): Promise<MaterialEntity> {
    const { id } = request.user;
    const { name } = payload;
    const material = await this.materialsService.findByName(name);

    if (material) throw new BadRequestException('Material already exists');

    return await this.materialsService.create({
      materialPayload: payload,
      creatorId: id,
    });
  }

  @ApiOkResponse({ type: [MaterialEntity] })
  @Roles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPERADMIN)
  @Get()
  async getAll(): Promise<MaterialEntity[]> {
    return await this.materialsService.findAll();
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MaterialEntity })
  @Roles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPERADMIN)
  @Put(':id')
  async update(
    @Req() request: CustomRequest,
    @Param('id') id: number,
    @Body() payload: UpdateMaterialDto,
  ): Promise<MaterialEntity> {
    const creatorId = request.user.id;

    const material = await this.materialsService.findById(id);
    if (!material) throw new NotFoundException('Material not found');

    return await this.materialsService.update({
      id,
      updatedPayload: payload,
      creatorId,
    });
  }

  @Roles(AdminRoleEnum.ADMIN, AdminRoleEnum.SUPERADMIN)
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MaterialEntity })
  @Delete(':id')
  async archive(@Param('id') id: number): Promise<MaterialEntity> {
    const material = await this.materialsService.findById(id);
    if (!material) throw new NotFoundException('Material not found');
    return await this.materialsService.archive(material);
  }
}
