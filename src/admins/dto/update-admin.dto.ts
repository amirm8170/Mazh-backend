import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdminRoleEnum } from '../enum/admin-type.enum';

export class UpdateAdminDetailsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'admin',
    type: String,
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'admin',
    type: String,
    required: false,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'something about admin',
    type: String,
    required: false,
  })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    required: false,
  })
  branchId?: number;

  @IsEnum(AdminRoleEnum)
  @IsOptional()
  @ApiPropertyOptional({
    example: AdminRoleEnum.ADMIN,
    type: String,
    required: false,
  })
  role?: AdminRoleEnum;
}

export class UpdateAdminPhoneNumber extends PickType(CreateAdminDto, [
  'phone',
] as const) {}
