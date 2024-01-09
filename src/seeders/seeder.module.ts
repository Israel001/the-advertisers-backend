import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lga } from 'src/entities/lga.entity';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { State } from 'src/entities/state.entity';
import { Roles } from 'src/modules/users/users.entity';
import databaseConfig from '../config/ormconfig';
import { ISeederConstructor } from './seeder.interface';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([NotificationTemplates, Roles, State, Lga]),
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
