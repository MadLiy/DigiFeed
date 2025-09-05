import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post introuvable');
    try {
      return await this.prisma.like.create({ data: { userId, postId } });
    } catch (e) {
      throw new ConflictException('Already liked');
    }
  }

  async unlikePost(userId: number, postId: number) {
    await this.prisma.like.deleteMany({ where: { userId, postId } });
    return { success: true };
  }

  async countLikes(postId: number) {
    return this.prisma.like.count({ where: { postId } });
  }
}
