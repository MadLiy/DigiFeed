import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseInterceptors(TransformInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async getAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.USER)
  async getMe(@Req() req) {
    const currentUserId = req.user.id;
    return this.usersService.getProfile(currentUserId, currentUserId);
  }

  // profil public d'un user
  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async getProfile(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const currentUserId = req.user ? Number(req.user.id) : undefined;
    return this.usersService.getProfile(id, currentUserId);
  }

  @Patch('me')
  @Roles(Role.ADMIN, Role.USER)
  async updateMe(@Req() req, @Body() data: UpdateUserDto) {
    const user = { id: req.user.id, role: req.user.role };
    return this.usersService.updateUser(user.id, user, data);
  }

  // supprimer son compte
  @Delete('me')
  @Roles(Role.ADMIN, Role.USER)
  async deleteMe(@Req() req) {
    const user = { id: req.user.id, role: req.user.role };
    return this.usersService.deleteUser(user.id, user);
  }

  // follow / unfollow
  @Post(':id/follow')
  @Roles(Role.USER)
  async follow(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const followerId = req.user.id;
    return this.usersService.followUser(followerId, id);
  }

  @Delete(':id/follow')
  @Roles(Role.USER)
  async unfollow(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const followerId = req.user.id;
    return this.usersService.unfollowUser(followerId, id);
  }

  // followers / following (pagination optionnelle)
  @Get(':id/followers')
  @Roles(Role.ADMIN, Role.USER)
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const take = query.take ? parseInt(query.take, 10) : 20;
    return this.usersService.getFollowers(id, skip, take);
  }

  @Get(':id/following')
  @Roles(Role.ADMIN, Role.USER)
  async getFollowing(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any,
  ) {
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const take = query.take ? parseInt(query.take, 10) : 20;
    return this.usersService.getFollowing(id, skip, take);
  }
}
