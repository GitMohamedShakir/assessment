import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './resources/jobs/jobs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './resources/user/user.module';
import { JwtStrategy } from './middleware/AuthStrategy';
import { MongoRepository } from 'typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redis from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APPLICATION_QUEUE_ID } from './constants/constants';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      store: redis,
      host: process.env.REDIS_HOST,
      port: 6379,
      ttl: 60 * 60,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    JobsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, MongoRepository],
  exports: [JwtStrategy, MongoRepository],
})
export class AppModule {}
