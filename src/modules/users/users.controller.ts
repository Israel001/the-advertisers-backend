import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateCustomerDto, CreateStoreDto, InviteUserDto } from './users.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { Request } from 'express';
import { Role } from 'src/decorators/roles.decorator';
import { StoreGuard } from 'src/guards/store-guard';
import { RoleGuard } from 'src/guards/role-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/customer')
  registerCustomer(@Body() body: CreateCustomerDto) {
    return this.usersService.createCustomer(body);
  }

  @Post('/store')
  registerStore(@Body() body: CreateStoreDto) {
    return this.usersService.createStore(body);
  }

  @Get('/roles')
  fetchRoles() {
    return this.usersService.fetchRoles();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserDetails(@Req() request: Request) {
    return this.usersService.getUserDetails(request.user as any);
  }

  @Post('/store/invite')
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner', 'admin'] })
  inviteUser(@Body() body: InviteUserDto, @Req() request: Request) {
    return this.usersService.inviteUser(body, request.user as any);
  }

  @Post('/store/remove/:userId')
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner'] })
  removeUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.removeUser(userId);
  }

  @Post('/store/:userId/:roleId')
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner'] })
  changeUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: Request,
  ) {
    return this.usersService.changeUserRole(
      userId,
      roleId,
      request.user as any,
    );
  }

  @Get('/store/users')
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner', 'admin'] })
  getStoreUsers(@Req() request: Request) {
    return this.usersService.getStoreUsers(request.user as any);
  }
}
