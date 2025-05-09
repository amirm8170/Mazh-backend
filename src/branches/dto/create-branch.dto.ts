import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'branch name',
    type: String,
    example: 'first branch',
    required: true,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  description?: string;
}
