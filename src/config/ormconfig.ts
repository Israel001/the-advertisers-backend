import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  charset: 'utf8mb4',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    path.join(
      __dirname,
      '..',
      '{entities,modules}/**/*.{entity,entities}.{ts,js}',
    ),
  ],
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  extra: {
    connectionLimit: 100,
  },
  migrationsRun: true,
  logging: true,
  logger: 'advanced-console',
  migrations: [path.join(__dirname, '..', '/migrations/**/*{.ts,.js}')],
};

export = config;
