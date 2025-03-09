import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/AuthGuard';
import { ApplyJobDto } from './dto/apply-job.dto';
import { JobsService } from '../jobs/jobs.service';
import { Request } from 'express';

@Controller('apply')
@UseGuards(JwtAuthGuard)
export class ApplyController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  apply(@Req() req: Request & { user: any}, @Body() applyJobDto: ApplyJobDto) {
    const userId = (req.user as any).userId;
    return this.jobsService.apply(applyJobDto, userId);
  }
}
