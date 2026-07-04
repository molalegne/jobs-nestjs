// dto/update-user.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsUrl()    avatarUrl?: string;
  @IsOptional() @IsString() telegramId?: string;

  // New Job Seeker fields
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsUrl()    defaultResumeUrl?: string;
  @IsOptional() @IsUrl()    portfolioUrl?: string;
  @IsOptional() @IsUrl()    githubUrl?: string;
  @IsOptional() @IsUrl()    linkedinUrl?: string;
  @IsOptional() @IsString({ each: true }) skills?: string[];
}

export class CreateCompanyDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsUrl()    logoUrl?: string;
  @IsOptional() @IsUrl()    website?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() size?: string;

  // New Company fields
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsUrl()    linkedinUrl?: string;
  @IsOptional() @IsUrl()    twitterUrl?: string;
  @IsOptional() @IsUrl()    facebookUrl?: string;
  @IsOptional() @IsString() coverImageUrl?: string;
  @IsOptional() @IsString({ each: true }) benefits?: string[];
  @IsOptional() foundedYear?: number;
}
