import { CreateMaterialDto } from '../dto/create-material.dto';
import { UpdateMaterialDto } from '../dto/update-material.dto';

export type TCreateMaterial = {
  materialPayload: CreateMaterialDto;
  creatorId: number;
};


export type TUpdateMaterial = {
  id:number , 
  updatedPayload:UpdateMaterialDto,
  creatorId:number
}
