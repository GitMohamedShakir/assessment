import { Test, TestingModule } from '@nestjs/testing';

import { ApplyController } from './apply.controller';
import { JobsService } from '../jobs/jobs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../user/entities/user.entity';
import { Application } from './entities/application.entity';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ObjectId } from 'mongodb';

jest.mock('../../middleware/AuthGuard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({})), // mock the JwtAuthGuard
}));

// Mocking the repositories
const mockJobRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockApplicationRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const cacheManagerMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};
describe('ApplyController', () => {
  let controller: ApplyController;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyController],
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockJobRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock, // Mock CACHE_MANAGER
        },
      ],
    }).compile();

    controller = module.get<ApplyController>(ApplyController);
    jobsService = module.get<JobsService>(JobsService);
  });

  it('should apply for a job successfully', async () => {
    const applyJobDto: ApplyJobDto = {
      jobId: '67cd70aa7b7b44604cc15b54'
    };

    const job = new Job();
    job._id = new ObjectId('67cd706eb806858e828382ec');

    const user = new User();
    user._id = new ObjectId('67cd70880ee9c8578b1837a9');;

    const application = new Application();
    application.job = job;
    application.user = user;

    // Mock the repository methods
    mockJobRepository().findOne.mockResolvedValue(job);
    mockUserRepository().findOne.mockResolvedValue(user);
    mockApplicationRepository().findOne.mockResolvedValue(null); // User has not applied yet
    mockApplicationRepository().create.mockReturnValue(application);
    mockApplicationRepository().save.mockResolvedValue(application);

    // Call the controller's apply method
    const result = await controller.apply({user: user._id.toString()} as any, applyJobDto);

    expect(result).toEqual(application);
    expect(mockApplicationRepository().save).toHaveBeenCalledWith(application);
  });

});
