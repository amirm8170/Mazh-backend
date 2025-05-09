import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { AdminRoleEnum } from 'src/admins/enum/admin-type.enum';

export const Roles = (...roles: Array<AdminRoleEnum>) =>
  SetMetadata('roles', roles);

export interface CustomRequest extends Request {
  user?: Partial<AdminEntity>;
}

@Injectable()
export class AdminAccessGuard implements CanActivate {
  private defaultAdmin = AdminRoleEnum.SUPERADMIN;

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    let roles = this.reflector.get<AdminRoleEnum[] | AdminRoleEnum>(
      'roles',
      context.getHandler(),
    );

    if (!roles || !roles.length) {
      roles = this.defaultAdmin;
    }

    if (roles && roles.length && roles.includes(AdminRoleEnum.ALL_ROLES)) {
      roles = Object.values(AdminRoleEnum).filter(
        (value) => typeof value === 'string',
      ) as AdminRoleEnum[];
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) return false;

    if (!roles.includes(user.role)) return false;

    return true;
  }
}
