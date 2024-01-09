import { INestApplicationContext, Logger } from '@nestjs/common';
import {
  IFindClassArgument,
  ISeeder,
  ISeederConstructor,
} from './seeder.interface';
import SeederModule from './seeder.module';

const logger = new Logger('MainSeeder');

export const parseCommandLineForClassFlag = (): IFindClassArgument => {
  const classFlag: IFindClassArgument = {
    foundArgument: false,
    foundValue: false,
  };
  process.argv.forEach((option: string, index, args: string[]) => {
    if (option === '--class' && !classFlag.foundArgument) {
      classFlag.argumentindex = index;
      classFlag.foundArgument = true;
    }
    if (classFlag.foundArgument && index === classFlag.argumentindex + 1) {
      if (option !== '=') {
        classFlag.foundValue = true;
        classFlag.className = option;
      }
      if (
        option === '=' &&
        Object.prototype.hasOwnProperty.call(args, classFlag.argumentindex + 2)
      ) {
        classFlag.foundValue = true;
        classFlag.className = args[classFlag.argumentindex + 2];
      }
    }
  });
  return classFlag;
};

export const startSeeding = async (
  appContext: INestApplicationContext,
  singleClass?: string,
) => {
  if (singleClass) {
    const foundSeeder = SeederModule.seederClasses.find(
      (seedClass: ISeederConstructor) => seedClass.name === singleClass,
    );
    if (foundSeeder) {
      const seedClass = appContext.get<ISeeder>(foundSeeder);
      logger.log(`About seeding ${singleClass}`);
      await seedClass.run();
      logger.log(`Done seeding ${singleClass}`);
    } else {
      logger.error(
        '\x1b[31m',
        'Could not find seeder class ',
        singleClass,
        '\x1b[0m',
      );
    }
    return;
  }
  const seedsArray = SeederModule.seederClasses;
  for (let index = 0; index < seedsArray.length; index++) {
    const seed = seedsArray[index];
    const seedClass = appContext.get<ISeeder>(seed);
    logger.log(`About seeding ${seed.name}`);
    await seedClass.run();
    logger.log(`Done seeding ${seed.name}`);
  }
};
