import { UpdateBranchDto } from '../dto/update-branch.dto';
import { BranchEntity } from '../entities/branch.entity';

export type TUpdateBranch = {
  branchId: number;
  updatedBranch: UpdateBranchDto;
};
