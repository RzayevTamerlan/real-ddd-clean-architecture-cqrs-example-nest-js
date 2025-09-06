import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters.' })
  readonly name: string;

  @ApiProperty({
    description: 'The last name (surname) of the user.',
    example: 'Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Surname must be a string.' })
  @IsNotEmpty({ message: 'Surname cannot be empty.' })
  @MinLength(3, { message: 'Surname must be at least 3 characters long.' })
  @MaxLength(50, { message: 'Surname cannot be longer than 50 characters.' })
  readonly surname: string;

  @ApiProperty({
    description:
      'The unique email address of the user. Will be used for login.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  readonly email: string;

  @ApiProperty({
    description: "The user's password. Must be between 8 and 50 characters.",
    example: 'Password123!',
    minLength: 8,
    maxLength: 50,
    format: 'password', // Swagger UI will often render this as a masked input
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(50, { message: 'Password cannot be longer than 50 characters.' })
  readonly password: string;

  @ApiProperty({
    description: "The user's phone number in Azerbaijan international format.",
    example: '+994501234567',
  })
  @IsPhoneNumber('AZ', { message: 'A valid phone number is required.' })
  @IsNotEmpty({ message: 'Phone number cannot be empty.' })
  readonly phone: string;
}
