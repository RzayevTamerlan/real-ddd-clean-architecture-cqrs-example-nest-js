import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: 3,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters.' })
  name: string;

  @ApiProperty({
    description: 'Surname of the user',
    example: 'Doe',
    minLength: 3,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: 'Surname must be a string.' })
  @IsNotEmpty({ message: 'Surname cannot be empty.' })
  @MinLength(3, { message: 'Surname must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Surname cannot be longer than 50 characters.' })
  surname: string;

  @ApiProperty({
    description: 'Phone number of the user in international format',
    example: '+994501234567',
    required: true,
  })
  @IsPhoneNumber('AZ', { message: 'A valid phone number is required.' })
  @IsNotEmpty({ message: 'Phone number cannot be empty.' })
  phone: string;
}
