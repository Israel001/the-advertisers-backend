import { Lga } from 'src/entities/lga.entity';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { State } from 'src/entities/state.entity';
import { AdminRoles } from 'src/modules/admin/admin.entities';
import { Roles } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';

export interface ISeeder {
  run(): Promise<any>;
}

export interface ISeederConstructor {
  new (...args): ISeeder;
}

export interface IFindClassArgument {
  foundArgument: boolean;
  foundValue: boolean;
  argumentindex?: number;
  className?: string;
}

export interface INotificationTemplatesSeed {
  code: string;
  body: string;
}

export interface IRolesSeed {
  name: string;
}

export interface IAdminUserSeed {
  fullName: string;
  email: string;
  password: string;
}

export interface IStatesSeed {
  name: string;
  strippedName: string;
  code: string;
}

export interface ILgaSeed {
  name: string;
  strippedName: string;
  code: string;
  state: IStatesSeed;
}

export interface ISeederRunnerArgs {
  templatesData?: INotificationTemplatesSeed[];
  notificationTemplateRepo?: Repository<NotificationTemplates>;
  rolesData?: IRolesSeed[];
  rolesRepo?: Repository<Roles>;
  adminRolesData?: IRolesSeed[];
  adminRolesRepo?: Repository<AdminRoles>;
  lgaData?: ILgaSeed[];
  statesRepo?: Repository<State>;
  lgaRepo?: Repository<Lga>;
}
