import * as process from 'node:process';

import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserEntity } from '@user/infrastructure/persistence/mikro-orm/entities/user.entity';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV;

console.log(`NODE_ENV: ${env}, HOST: ${process.env.HOST}`);

dotenv.config({
  path:
    env === 'development'
      ? `.env.development${process.env.HOST ? `.${process.env.HOST}` : ''}`
      : `.env.production${process.env.HOST ? `.${process.env.HOST}` : ''}`,
});

console.log('Database Connection String:', process.env.DB_URL);

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DB_URL,
  entities: [UserEntity],
  migrations: {
    path: './dist/shared/infrastructure/persistence/mikro-orm/db/migrations',
    pathTs: './src/shared/infrastructure/persistence/mikro-orm/db/migrations',
  },
  allowGlobalContext: true,
  timezone: 'UTC',
  debug: process.env.NODE_ENV === 'development' && process.env.HOST === 'local',
  validate: true,
  strict: true,
  // seeder: {
  //   path: './dist/shared/infrastructure/persistence/mikro-orm/db/seeds',
  //   pathTs: './src/shared/infrastructure/persistence/mikro-orm/db/seeds',
  //   defaultSeeder: 'DatabaseSeeder',
  //   glob: '!(*.d).{js,ts}',
  //   emit: 'ts',
  // },
  extensions: [Migrator],
};

export default config;
