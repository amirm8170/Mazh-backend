import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { OmitType, PickType } from '@nestjs/swagger';

export class UpdateAdminDetailsDto extends PartialType(
  OmitType(CreateAdminDto, ['phone'] as const),
) {}

export class UpdateAdminPhoneNumber extends PickType(CreateAdminDto, [
  'phone',
] as const) {}
