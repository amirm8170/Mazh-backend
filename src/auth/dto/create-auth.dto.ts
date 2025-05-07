import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'enter valid phone number',
    type: String,
    example: '091243567950',
    required: true,
  })
  phoneNumber: string;
}

export class OTPLogin {
  @IsString()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'enter valid phone number',
    type: String,
    example: '091243567950',
    required: true,
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
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
