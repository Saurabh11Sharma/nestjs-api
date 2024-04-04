import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export const Serialize = <T>(DTO: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeInterceptor(DTO));
};

class SerializeInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private DTO: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.DTO, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
