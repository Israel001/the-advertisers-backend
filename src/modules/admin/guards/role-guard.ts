import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/decorators/admin_roles.decorator';
import { RoleDecoratorOptionsInterface } from 'src/types';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );
    const rolesMetadatas: RoleDecoratorOptionsInterface[] = [];
    const roleMetadata =
      this.reflector.getAllAndOverride<RoleDecoratorOptionsInterface>(
        META_ROLES,
        [context.getClass(), context.getHandler()],
      );
    if (roleMetadata) rolesMetadatas.push(roleMetadata);
    const combinedRoles = rolesMetadatas.flatMap((x) => x.roles);
    if (!combinedRoles.length) return true;
    const request = context.switchToHttp().getRequest();
    return (
      allowUnauthorizedRequest ||
      combinedRoles.some(
        (r) => r.toLowerCase() === request.user.role.name.toLowerCase(),
      )
    );
  }
}
