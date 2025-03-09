import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongoRepository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Application } from '../apply/entities/application.entity';
import { User } from '../user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { APPLICATION_QUEUE_ID } from 'src/constants/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, User, Job]),
    CacheModule.register(),
    ClientsModule.register([
      {
        name: 'JOB_QUEUE_APPLICATIONS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL],
          queue: APPLICATION_QUEUE_ID,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [JobsController],
  providers: [
    JobsService,
    {
      provide: 'APPLICATION_QUEUE_ID',
      useValue: APPLICATION_QUEUE_ID,
    },
  ],
  exports: [JobsService],
})
export class JobsModule {}
