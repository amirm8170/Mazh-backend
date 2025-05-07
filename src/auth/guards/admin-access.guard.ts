import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminTypeEnum } from 'src/admins/enum/admin-type.enum';

export const Roles = (...roles: Array<AdminTypeEnum>) =>
  SetMetadata('roles', roles);

@Injectable()
export class AdminAccessGuard implements CanActivate {
  private defaultAdmin = AdminTypeEnum.SUPERADMIN;

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('roles', context.getHandler());
    if (isPublic) return true;

    let roles = this.reflector.get<AdminTypeEnum[] | AdminTypeEnum>(
      'roles',
      context.getHandler(),
    );

    if (!roles || !roles.length) {
      roles = this.defaultAdmin;
    }

    if (roles && roles.length && roles.includes(AdminTypeEnum.ALL_ROLES)) {
      roles = Object.values(AdminTypeEnum).filter(
        (value) => typeof value === 'string',
      ) as AdminTypeEnum[];
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) return false;

    if (!roles.includes(user.roles)) return false;

    return true;
  }
}
