import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @ApiResponse({ status: 201, description: 'Post créé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  create(@Body() data: CreatePostDto, @Req() req) {
    const userId = req.user.id;
    return this.posts.createPost(userId, data);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @ApiResponse({ status: 200, description: 'Posts trouvés' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  findAll() {
    return this.posts.findAll();
  }

  @Get('feed')
  @Roles(Role.ADMIN, Role.USER)
  @ApiResponse({ status: 201, description: 'Post créé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getFeed(
    @Req() req,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
  ) {
    const userId = req.user.id;
    return this.posts.getFeed(userId, skip, take);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Post trouvé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiResponse({ status: 201, description: 'Post mis à jour' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePostDto>,
    @Req() req,
  ) {
    const user = req.user;
    return this.posts.update(id, user, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Post suprimé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Token expirée' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Roles(Role.ADMIN, Role.USER)
  delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    return this.posts.deletePost(id, user);
  }
}
