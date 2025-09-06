import * as process from 'node:process';

import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';

export const getMikroOrmConfig = (
  configService: ConfigService,
): MikroOrmModuleOptions => {
  console.log('Connection String', configService.get('DB_URL'));
  return {
    driver: PostgreSqlDriver,
    clientUrl: configService.get('DB_URL'),
    autoLoadEntities: true,
    migrations: {
      path: './db/migrations',
      pathTs: './db/migrations',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      disableForeignKeys: false,
      allOrNothing: true,
    },
    registerRequestContext: true,
    allowGlobalContext: true, // Needed for some NestJS operations
    timezone: 'UTC',
    debug:
      process.env.NODE_ENV === 'development' && process.env.HOST === 'local',
    // Entity discovery
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    validate: true,
    strict: true,
    seeder: {
      path: '.src/infrastructure/db/seeds',
      pathTs: '.src/infrastructure/db/seeds',
      defaultSeeder: 'DatabaseSeeder',
      glob: '!(*.d).{js,ts}',
      emit: 'ts',
    },
  };
};
