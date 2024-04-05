import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: `${process.env.NODE_ENV}.sqlite`,
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions);
