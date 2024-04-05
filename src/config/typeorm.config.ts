import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configSerice: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      synchronize: this.configSerice.get<boolean>('SYNCHRONIZE'),
      type: 'sqlite',
      database: this.configSerice.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: this.configSerice.get<boolean>('MIGRATIONS_RUN'),
      keepConnectionAlive: this.configSerice.get<boolean>(
        'KEEP_CONNECTION_ALIVE',
      ),
    };
  }
}
