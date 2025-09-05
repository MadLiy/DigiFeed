import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikePostDto } from './dto/like-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('likes')
@UseInterceptors(TransformInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  @Roles(Role.USER)
  async like(@Req() req, @Body() dto: LikePostDto) {
    const userId = req.user.id;
    return this.likesService.likePost(userId, dto.postId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async unlike(@Req() req, @Param('id', ParseIntPipe) postId: number) {
    const userId = req.user.id;
    return this.likesService.unlikePost(userId, postId);
  }

  @Get(':id/count')
  @Roles(Role.ADMIN, Role.USER)
  async count(@Param('id', ParseIntPipe) postId: number) {
    const total = await this.likesService.countLikes(postId);
    return { postId, likes: total };
  }
}
