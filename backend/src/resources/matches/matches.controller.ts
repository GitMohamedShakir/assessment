import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/AuthGuard';
import { JobsService } from '../jobs/jobs.service';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly jobsService: JobsService) {}
  @Get('/:userId')
  async create(@Param('userId') userId: string) {
    return this.jobsService.matches(userId);
  }
}
