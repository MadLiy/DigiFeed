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
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikePostDto } from './dto/like-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('likes')
@UseGuards(AuthGuard)
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  async like(@Req() req, @Body() dto: LikePostDto) {
    const userId = req.user.id;
    return this.likesService.likePost(userId, dto.postId);
  }

  @Delete(':id')
  async unlike(@Req() req, @Param('id', ParseIntPipe) postId: number) {
    const userId = req.user.id;
    return this.likesService.unlikePost(userId, postId);
  }

  @Get(':id/count')
  async count(@Param('id', ParseIntPipe) postId: number) {
    const total = await this.likesService.countLikes(postId);
    return { postId, likes: total };
  }
}
