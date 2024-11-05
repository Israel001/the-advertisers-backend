import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lga } from '../entities/lga.entity';
import { NotificationTemplates } from '../entities/notification-templates.entity';
import { State } from '../entities/state.entity';
import { Roles } from '../modules/users/users.entity';
import databaseConfig from '../config/ormconfig';
import { ISeederConstructor } from './seeder.interface';
import { AdminRoles } from '../modules/admin/admin.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([
      NotificationTemplates,
      Roles,
      State,
      Lga,
      AdminRoles,
    ]),
  ],
})
export default class SeederModule {
  public static seederClasses: ISeederConstructor[] = [];
  static forRoot(seeders: ISeederConstructor[]): DynamicModule {
    SeederModule.seederClasses = seeders || [];
    return {
      global: true,
      module: SeederModule,
      providers: seeders,
    };
  }
}
