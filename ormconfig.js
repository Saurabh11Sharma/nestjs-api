const ormConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'dev':
    Object.assign(ormConfig, {
      type: 'sqlite',
      database: 'dev.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(ormConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'prod':
    Object.assign(ormConfig, {
      type: 'sqlite',
      database: 'prod.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  default:
    throw new Error('Unknown Environment');
}

module.exports = ormConfig;
