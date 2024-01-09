import { Injectable } from '@nestjs/common';
import { IRolesSeed, ISeeder } from '../seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/modules/users/users.entity';
import { seederRunner } from '../shared';

@Injectable()
export default class RolesSeed implements ISeeder {
  private rolesData: IRolesSeed[] = [
    {
      name: 'Owner',
    },
    {
      name: 'Admin',
    },
    {
      name: 'User',
    },
  ];

  constructor(@InjectRepository(Roles) private rolesRepo: Repository<Roles>) {}

  async run(): Promise<boolean> {
    return seederRunner({
      rolesData: this.rolesData,
      rolesRepo: this.rolesRepo,
    });
  }
}
