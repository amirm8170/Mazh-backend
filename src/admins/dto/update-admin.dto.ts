import { CreateAdminDto } from './create-admin.dto';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdminRoleEnum } from '../enum/admin-type.enum';

export class UpdateAdminDetailsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'admin',
    type: 'string',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'admin',
    type: 'string',
    required: false,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'something about admin',
    type: 'string',
    required: false,
  })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'number',
    required: false,
  })
  branchId?: number;

  @IsEnum(AdminRoleEnum)
  @IsOptional()
  @ApiPropertyOptional({
    example: AdminRoleEnum.ADMIN,
    enum: AdminRoleEnum,
    required: false,
  })
  role?: AdminRoleEnum;
}

export class UpdateAdminPhoneDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
