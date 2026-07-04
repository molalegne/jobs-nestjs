import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, CreateCompanyDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, email: true, firstName: true, lastName: true, role: true, 
        avatarUrl: true, phone: true, telegramId: true, createdAt: true, 
        company: true, headline: true, bio: true, location: true, 
        defaultResumeUrl: true, portfolioUrl: true, githubUrl: true, 
        linkedinUrl: true, skills: true 
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({ 
      where: { id }, 
      data: dto,
      select: { 
        id: true, email: true, firstName: true, lastName: true, role: true, 
        avatarUrl: true, phone: true, telegramId: true, createdAt: true, 
        company: true, headline: true, bio: true, location: true, 
        defaultResumeUrl: true, portfolioUrl: true, githubUrl: true, 
        linkedinUrl: true, skills: true 
      },
    });
  }

  async createCompany(userId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({ data: { ...dto, userId } });
  }

  async getCompany(userId: string) {
    return this.prisma.company.findUnique({ where: { userId }, include: { jobs: { take: 5, orderBy: { createdAt: 'desc' } } } });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markNotificationRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({ where: { id: notificationId, userId }, data: { read: true } });
  }
}
