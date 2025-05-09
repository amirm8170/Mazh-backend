import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdminRoleEnum } from '../enum/admin-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '09125476123',
    type: 'string',
    required: true,
  })
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    required: true,
  })
  branchId: number;

  @IsEnum(AdminRoleEnum)
  @IsNotEmpty()
  @ApiProperty({
    example: AdminRoleEnum.ADMIN,
    enum: AdminRoleEnum,
  })
  role: AdminRoleEnum;
}
