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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  create(@Body() data: CreatePostDto, @Req() req) {
    const userId = req.user.id;
    return this.posts.createPost(userId, data);
  }

  @Get()
  findAll() {
    return this.posts.findAll();
  }

  @Get('feed')
  async getFeed(
    @Req() req,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
  ) {
    const userId = req.user.id;
    return this.posts.getFeed(userId, skip, take);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePostDto>,
    @Req() req,
  ) {
    const user = req.user;
    return this.posts.update(id, user, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    return this.posts.deletePost(id, user);
  }
}
