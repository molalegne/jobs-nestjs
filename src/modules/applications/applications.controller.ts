import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly svc: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a job application — triggers AI screening workflow' })
  submit(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateApplicationDto) {
    return this.svc.submit(user.userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all applications for the current user' })
  myApplications(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.findByUser(user.userId);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get all applications for a job (employer only)' })
  byJob(@Param('jobId') jobId: string, @CurrentUser() user: CurrentUserPayload) {
    return this.svc.findByJob(jobId, user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status (employer action)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.svc.updateStatus(id, dto.status, user.userId);
  }
}
