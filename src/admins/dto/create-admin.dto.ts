import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdminTypeEnum } from '../enum/admin-type.enum';
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
  @IsNotEmpty()
  @ApiProperty({
    example: '09125476123',
    type: String,
    required: true,
  })
  phone: string;

  @IsEnum(AdminTypeEnum)
  @IsNotEmpty()
  @ApiProperty({
    example: AdminTypeEnum.ADMIN,
    type: String,
    required: true,
  })
  type: AdminTypeEnum;
}
