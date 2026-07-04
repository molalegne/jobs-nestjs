// users.controller.ts
import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateCompanyDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get('profile')
  profile(@CurrentUser() u: CurrentUserPayload) { return this.svc.findById(u.userId); }

  @Patch('profile')
  update(@CurrentUser() u: CurrentUserPayload, @Body() dto: UpdateUserDto) { return this.svc.update(u.userId, dto); }

  @Get('company')
  getCompany(@CurrentUser() u: CurrentUserPayload) { return this.svc.getCompany(u.userId); }

  @Post('company')
  createCompany(@CurrentUser() u: CurrentUserPayload, @Body() dto: CreateCompanyDto) { return this.svc.createCompany(u.userId, dto); }

  @Get('notifications')
  notifications(@CurrentUser() u: CurrentUserPayload) { return this.svc.getNotifications(u.userId); }

  @Patch('notifications/:id/read')
  markRead(@Param('id') id: string, @CurrentUser() u: CurrentUserPayload) { return this.svc.markNotificationRead(id, u.userId); }
}
