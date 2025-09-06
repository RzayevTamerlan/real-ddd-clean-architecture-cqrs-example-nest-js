import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPassword123!',
  })
  @Length(8, 50, {
    message: 'Current password must be between 8 and 50 characters long',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'NewPassword456!',
  })
  @Length(8, 50, {
    message: 'New password must be between 8 and 50 characters long',
  })
  newPassword: string;
}
