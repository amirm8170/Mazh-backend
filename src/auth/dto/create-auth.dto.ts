import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, Min } from 'class-validator';

export class AdminLoginDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'enter valid phone number',
    type: Number,
    example: '5546530945',
    required: true,
  })
  phoneNumber: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;
}

export class UserLoginDto {
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'enter valid phone number',
    type: Number,
    example: '5546530945',
  })
  phoneNumber: number;
}
