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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '09125476123',
    type: String,
    required: true,
  })
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  branchId: number;

  @IsEnum(AdminRoleEnum)
  @IsNotEmpty()
  @ApiProperty({
    example: AdminRoleEnum.ADMIN,
    type: String,
    required: true,
  })
  role: AdminRoleEnum;
}
