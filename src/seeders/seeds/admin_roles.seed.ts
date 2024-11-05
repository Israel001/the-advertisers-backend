import { Injectable } from '@nestjs/common';
import { IRolesSeed, ISeeder } from '../seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { seederRunner } from '../shared';
import { AdminRoles } from '../../modules/admin/admin.entities';

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
    {
      name: 'Delivery Agent'
    }
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
