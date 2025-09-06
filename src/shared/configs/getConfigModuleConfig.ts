import { ConfigModuleOptions } from '@nestjs/config';

export const getConfigModuleConfig = (): ConfigModuleOptions => {
  return {
    isGlobal: true,
    envFilePath: `.env.${process?.env?.NODE_ENV || ''}${process.env.HOST ? `.${process.env.HOST}` : ''}`,
    validate: (config) => {
      if (!config.POSTGRES_USER) throw new Error('Missing POSTGRES_USER');
      if (!config.POSTGRES_PASSWORD)
        throw new Error('Missing POSTGRES_PASSWORD');
      if (!config.DB_TYPE) throw new Error('Missing DB_TYPE');
      if (!config.POSTGRES_DB) throw new Error('Missing POSTGRES_DB');
      if (!config.POSTGRES_PORT) throw new Error('Missing POSTGRES_HOST');
      if (!config.DB_URL) throw new Error('Missing DB_URL');
      return config;
    },
  };
};
