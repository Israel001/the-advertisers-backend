import { SetMetadata } from '@nestjs/common';
import { RoleDecoratorOptionsInterface } from 'src/types';

export const META_ROLES = 'role';

export const Role = (roleMetadata: RoleDecoratorOptionsInterface) =>
  SetMetadata(META_ROLES, roleMetadata);
