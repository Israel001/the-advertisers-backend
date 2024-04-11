import { SetMetadata } from '@nestjs/common';
import { RoleDecoratorOptionsInterface } from 'src/types';

export const META_ROLES = 'admin_role';

export const AdminRole = (roleMetadata: RoleDecoratorOptionsInterface) =>
  SetMetadata(META_ROLES, roleMetadata);
