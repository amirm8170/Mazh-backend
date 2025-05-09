import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'branch name',
    type: 'string',
    example: 'first branch',
    required: true,
  })
  name: string;

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
