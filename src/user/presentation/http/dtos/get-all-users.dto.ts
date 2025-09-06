import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@shared/application/dtos/pagination.dto';
import { Status } from '@user/domain/enums/status';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetAllUsersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search term to filter users by name or email',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter users by status',
    example: 'ACTIVE',
    enum: Status,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
