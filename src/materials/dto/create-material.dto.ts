import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({
    example: 'Liter',
    description: ' unit of measure',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
    example: 'milk',
    description: 'material name',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
