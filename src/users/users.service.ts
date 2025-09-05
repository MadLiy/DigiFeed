import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    if (!email) throw new Error('Email manquant');
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { posts: true, likes: true, following: true, followers: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });
  }

  async create(data: RegisterDto) {
    const { name, email, password } = data;
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email déjà utilisé');

    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getProfile(targetUserId: number, currentUserId?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        _count: { select: { posts: true, followers: true, following: true } },
        // optionally last posts:
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, createdAt: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isFollowing = currentUserId
      ? !!(await this.prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          },
        }))
      : false;

    return { ...user, isFollowing };
  }

  async updateUser(
    targetUserId: number,
    user: { id: number; role: string },
    data: UpdateUserDto,
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) throw new NotFoundException('Utilisateur introuvable');

    if (user.id !== targetUserId && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier cet utilisateur",
      );
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(targetUserId: number, caller: { id: number; role: string }) {
    if (caller.id !== targetUserId && caller.role !== 'ADMIN') {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer cet utilisateur",
      );
    }

    // suppression en transaction pour éviter FK errors
    await this.prisma.$transaction([
      this.prisma.like.deleteMany({ where: { userId: targetUserId } }),
      this.prisma.like.deleteMany({
        where: { post: { authorId: targetUserId } },
      }), // likes on user's posts
      this.prisma.follow.deleteMany({
        where: {
          OR: [{ followerId: targetUserId }, { followingId: targetUserId }],
        },
      }),
      this.prisma.post.deleteMany({ where: { authorId: targetUserId } }),
      this.prisma.user.delete({ where: { id: targetUserId } }),
    ]);

    return { success: true };
  }

  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId)
      throw new BadRequestException('Vous ne pouvez pas vous suivre vous-même');

    const exists = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!exists)
      throw new NotFoundException('Utilisateur à suivre introuvable');

    try {
      const follow = await this.prisma.follow.create({
        data: { followerId, followingId },
      });
      return follow;
    } catch (e) {
      throw new ConflictException('Vous suivez déjà cet utilisateur');
    }
  }

  async unfollowUser(followerId: number, followingId: number) {
    const deleted = await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
    if (deleted.count === 0)
      throw new NotFoundException('Vous ne suivez pas cet utilisateur');
    return { success: true };
  }

  async getFollowers(userId: number, skip = 0, take = 20) {
    const [items, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: { select: { id: true, name: true, createdAt: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return {
      items: items.map((i) => ({
        id: i.follower.id,
        name: i.follower.name,
        followedAt: i.createdAt,
      })),
      total,
      skip,
      take,
    };
  }

  async getFollowing(userId: number, skip = 0, take = 20) {
    const [items, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: { select: { id: true, name: true, createdAt: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return {
      items: items.map((i) => ({
        id: i.following.id,
        name: i.following.name,
        followedAt: i.createdAt,
      })),
      total,
      skip,
      take,
    };
  }
}
