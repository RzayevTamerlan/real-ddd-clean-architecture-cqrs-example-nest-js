import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@shared/application/presentation/base.controller';
import { ChangePasswordCommand } from '@user/application/commands/change-password.command';
import { CreateUserCommand } from '@user/application/commands/create-user.command';
import { DeleteUserCommand } from '@user/application/commands/delete-user.command';
import { UpdateUserCommand } from '@user/application/commands/update-user.command';
import { GetAllUsersQuery } from '@user/application/queries/get-all-users.query';
import { GetUserByEmailQuery } from '@user/application/queries/get-user-by-email.query';
import { GetUserByIdQuery } from '@user/application/queries/get-user-by-id.query';
import { ChangePasswordDto } from '@user/presentation/http/dtos/change-password.dto';
import { CreateUserDto } from '@user/presentation/http/dtos/create-user.dto';
import { GetAllUsersDto } from '@user/presentation/http/dtos/get-all-users.dto';
import { GetUserByEmailDto } from '@user/presentation/http/dtos/get-user-by-email.dto';
import { UpdateUserDto } from '@user/presentation/http/dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  // MUTATIONS
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body()
    dto: CreateUserDto,
  ) {
    const command = new CreateUserCommand({
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
    });
    const result = await this.commandBus.execute(command);
    return this.handleResult(result);
  }

  @Put(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body()
    dto: UpdateUserDto,
  ) {
    const command = new UpdateUserCommand({
      userId,
      name: dto.name,
      surname: dto.surname,
      phone: dto.phone,
    });
    const result = await this.commandBus.execute(command);
    return this.handleResult(result);
  }

  @Patch(':userId/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body()
    dto: ChangePasswordDto,
  ) {
    const command = new ChangePasswordCommand(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
    const result = await this.commandBus.execute(command);
    return this.handleResult(result);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const command = new DeleteUserCommand(userId);
    const result = await this.commandBus.execute(command);
    return this.handleResult(result);
  }

  // QUERIES

  @Get()
  async getAllUsers(
    @Query()
    queryDto: GetAllUsersDto,
  ) {
    const query = new GetAllUsersQuery({
      page: queryDto.page,
      limit: queryDto.limit,
      search: queryDto.search,
      status: queryDto.status,
    });
    return this.queryBus.execute(query);
  }

  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email of the user to retrieve',
    example: 'john.doe@example.com',
  })
  @Get('by-email/:email')
  async getUserByEmail(@Param() params: GetUserByEmailDto) {
    const query = new GetUserByEmailQuery(params.email);
    const result = await this.queryBus.execute(query);

    if (!result) {
      throw new NotFoundException(`User with email ${params.email} not found.`);
    }
    return result;
  }

  @Get(':userId')
  async getUserById(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const query = new GetUserByIdQuery(userId);
    const result = await this.queryBus.execute(query);

    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return result;
  }
}
