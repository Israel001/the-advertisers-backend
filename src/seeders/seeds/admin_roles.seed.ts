import { Injectable } from '@nestjs/common';
import { IRolesSeed, ISeeder } from '../seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/modules/users/users.entity';
import { seederRunner } from '../shared';
import { AdminRoles } from 'src/modules/admin/admin.entities';

@Injectable()
export default class AdminRolesSeed implements ISeeder {
  private rolesData: IRolesSeed[] = [
    {
      name: 'Super Admin',
    },
    {
      name: 'Admin',
    },
    {
      name: 'Editor',
    },
    {
      name: 'User',
    },
    {
      name: 'Simple User',
    },
  ];

  constructor(
    @InjectRepository(AdminRoles) private rolesRepo: Repository<AdminRoles>,
  ) {}

  async run(): Promise<boolean> {
    return seederRunner({
      adminRolesData: this.rolesData,
      adminRolesRepo: this.rolesRepo,
    });
  }
}
