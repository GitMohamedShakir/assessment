import { Inject, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { MongoRepository, MoreThan } from 'typeorm';
import { ApplyJobDto } from '../apply/dto/apply-job.dto';
import { Application } from '../apply/entities/application.entity';
import { User } from '../user/entities/user.entity';
import {
  APPLICATION_QUEUE_ID,
  JobApplicationStatus,
} from 'src/constants/constants';
import moment from 'moment';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private repositoryJob: MongoRepository<Job>,

    @InjectRepository(User)
    private repositoryUser: MongoRepository<User>,
    @InjectRepository(Job)
    private repositoryApplication: MongoRepository<Application>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    // @Inject(APPLICATION_QUEUE_ID)
    // private client: ClientProxy,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const job = this.repositoryJob.create(createJobDto);
    return await this.repositoryJob.save(job);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const cacheKey = `jobs_${page}_${limit}`;
    const cachedJobs = await this.cacheManager.get(cacheKey);

    if (cachedJobs) {
      return cachedJobs;
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await this.repositoryJob.findAndCount({
      skip,
      take: limit,
    });

    const result = {
      data: jobs,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };

    // Cache the result for 1 hour
    await this.cacheManager.set(cacheKey, result, 60 * 60);

    return result;
  }

  async apply(applyJobDto: ApplyJobDto, userId: string) {
    const { jobId } = applyJobDto;

    // Check if the job exists
    const job = await this.repositoryJob.findOne({ where: { id: jobId } });
    if (!job) {
      throw new Error('Job not found');
    }

    // Check if the user exists
    const user = await this.repositoryUser.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has already applied for this job
    const existingApplication = await this.repositoryApplication.findOne({
      where: { job: jobId, user: userId },
    });

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    // Rate Limiting: Check if the user has applied to 5 jobs in the last hour
    const oneHourAgo = moment().subtract(1, 'hour').toDate();
    const recentApplications = await this.repositoryApplication.count({
      where: {
        user: userId,
        createdAt: MoreThan(oneHourAgo),
      },
    });

    if (recentApplications >= 5) {
      throw new Error('You can only apply for 5 jobs per hour');
    }

    // If no existing application, create a new application
    const newApplication = this.repositoryApplication.create({
      user,
      job,
      status: JobApplicationStatus.APPLIED,
    });

    return await this.repositoryApplication.save(newApplication);

    // // Send message to the queue for async processing
    // this.client.emit('job_application', {
    //   userId,
    //   jobId,
    // });

    // return { message: 'Your application is being processed' };
  }


  // @MessagePattern(APPLICATION_QUEUE_ID)
  // async process(@Payload() payload: any) {

  //   const { userId, jobId } = payload;

  //   // Check if the job exists
  //   const job = await this.repositoryJob.findOne({ where: { id: jobId } });
  //   if (!job) {
  //     throw new Error('Job not found');
  //   }

  //   // Check if the user exists
  //   const user = await this.repositoryUser.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   // Check if the user has already applied for this job
  //   const existingApplication = await this.repositoryApplication.findOne({
  //     where: { job: jobId, user: userId },
  //   });

  //   if (existingApplication) {
  //     throw new Error('You have already applied for this job');
  //   }

  
  //   // If no existing application, create a new application
  //   const newApplication = this.repositoryApplication.create({
  //     user,
  //     job,
  //     status: JobApplicationStatus.APPLIED,
  //   });

  //   return await this.repositoryApplication.save(newApplication);
  // }

  async matches(userId: string) {
    // Fetch user by ID
    const user = await this.repositoryUser.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch the user's skills
    const userSkills = user.skills || [];

    // If user has no skills, return an empty list of matching jobs
    if (userSkills.length === 0) {
      return { jobs: [] };
    }

    // Fetch jobs that match the user's skills
    const matchingJobs = await this.repositoryJob.find({
      where: {
        skills: { $in: userSkills }, // MongoDB query to match jobs with user's skills
      },
    });

    return { jobs: matchingJobs };
  }
}
