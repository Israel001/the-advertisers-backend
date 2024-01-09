import { Logger } from '@nestjs/common';
import {
  ILgaSeed,
  INotificationTemplatesSeed,
  IRolesSeed,
  ISeederRunnerArgs,
} from './seeder.interface';
import { Repository } from 'typeorm';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { Roles } from 'src/modules/users/users.entity';
import { Lga } from 'src/entities/lga.entity';
import { State } from 'src/entities/state.entity';

const logger = new Logger('SeederRunner');

const saveTemplate = async (
  template: INotificationTemplatesSeed,
  notificationTemplateRepo: Repository<NotificationTemplates>,
) => {
  const templateModel = notificationTemplateRepo.create({
    code: template.code,
    body: template.body,
  });
  await notificationTemplateRepo.save(templateModel);
};

const saveRole = async (role: IRolesSeed, rolesRepo: Repository<Roles>) => {
  const roleModel = rolesRepo.create({ name: role.name });
  await rolesRepo.save(roleModel);
};

const saveLga = async (
  lga: ILgaSeed,
  statesRepo: Repository<State>,
  lgaRepo: Repository<Lga>,
) => {
  let stateData = await statesRepo.findOneBy({ code: lga.state.code });
  if (!stateData) {
    const stateModel = statesRepo.create({
      name: lga.state.name,
      strippedName: lga.state.strippedName,
      code: lga.state.code,
    });
    stateData = await statesRepo.save(stateModel);
  }
  const lgaModel = lgaRepo.create({
    name: lga.name,
    strippedName: lga.strippedName,
    code: lga.code,
    state: { id: stateData.id },
  });
  await lgaRepo.save(lgaModel);
};

export const seederRunner = async ({
  templatesData,
  notificationTemplateRepo,
  rolesData,
  rolesRepo,
  lgaData,
  statesRepo,
  lgaRepo,
}: ISeederRunnerArgs) => {
  if (notificationTemplateRepo) {
    await notificationTemplateRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await notificationTemplateRepo.clear();
    if (templatesData && templatesData.length) {
      for (const template of templatesData) {
        await saveTemplate(template, notificationTemplateRepo).catch(
          (error) => {
            logger.error(
              `Error occurred when seeding template: '${template.code}'`,
              error.stack,
              'NotificationTemplateSeeder',
            );
          },
        );
      }
    }
    await notificationTemplateRepo.query('SET FOREIGN_KEY_CHECKS = 1;');
  }
  if (rolesRepo) {
    await rolesRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await rolesRepo.clear();
    if (rolesData && rolesData.length) {
      for (const role of rolesData) {
        await saveRole(role, rolesRepo).catch((error) => {
          logger.error(
            `Error occurred when seeding role: '${role.name}'`,
            error.stack,
            'RolesSeeder',
          );
        });
      }
    }
    await rolesRepo.query('SET FOREIGN_KEY_CHECKS = 1;');
  }
  if (lgaRepo && statesRepo) {
    await lgaRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await lgaRepo.clear();
    await statesRepo.clear();
    if (lgaData && lgaData.length) {
      for (const lga of lgaData) {
        await saveLga(lga, statesRepo, lgaRepo).catch((error) => {
          logger.error(
            `Error occurred when seeding lga: '${lga.name}'`,
            error.stack,
            'LgaSeeder',
          );
        });
      }
    }
    await lgaRepo.query('SET FOREIGN_KEY_CHECKS = 1;');
  }
  return true;
};
