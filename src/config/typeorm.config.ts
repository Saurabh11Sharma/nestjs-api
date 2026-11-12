import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private getBoolean(key: string, fallback: boolean): boolean {
    const value = this.configService.get<string>(key);

    if (value === undefined || value.trim() === '') {
      return fallback;
    }

    const normalised = value.trim().toLowerCase();

    if (normalised === 'true' || normalised === '1') {
      return true;
    }

    if (normalised === 'false' || normalised === '0') {
      return false;
    }

    throw new Error(`Environment variable ${key} must be true or false.`);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnvironment = this.configService.get<string>('NODE_ENV', 'dev');

    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_NAME', `${nodeEnvironment}.sqlite`),
      synchronize: this.getBoolean('SYNCHRONIZE', false),
      migrationsRun: this.getBoolean('MIGRATIONS_RUN', false),
      keepConnectionAlive: this.getBoolean('KEEP_CONNECTION_ALIVE', false),
      autoLoadEntities: true,
    };
  }
}
