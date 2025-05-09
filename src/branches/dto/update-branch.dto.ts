import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'branch name',
    type: 'string',
    example: 'first branch',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    required: false,
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    required: false,
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    required: false,
  })
  description?: string;
}
