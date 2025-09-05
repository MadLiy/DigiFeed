import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(authorId: number, dto: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: {
        authorId,
        content: dto.content,
        imageUrl: dto.imageUrl ?? null,
      },
      include: { author: true },
    });
  }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: { author: true, likes: true },
    });
  }

  async findOne(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true, likes: true },
    });
  }

  async update(
    @Param('id') id: number,
    user: { id: number; role: string },
    @Body() data,
  ): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post introuvable');
    }
    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier ce post",
      );
    }
    return this.prisma.post.update({
      where: { id },
      data,
      include: { author: true, likes: true },
    });
  }

  async deletePost(
    @Param('id') id: number,
    user: { id: number; role: string },
  ) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post introuvable');
    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier ce post",
      );
    }
    return this.prisma.post.delete({ where: { id } });
  }

  async getFeed(userId: number, skip: number, take: number) {
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);
    return this.prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      include: {
        author: { select: { id: true, name: true } },
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}
