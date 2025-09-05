import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    if (!email) throw new Error('Email manquant');
    return this.prisma.user.findUnique({ where: { email } });
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

  // async followUser(followerId: string, followingId: string) {
  //   if (followerId === followingId)
  //     throw new BadRequestException('Cannot follow yourself');
  //   return this.prisma.follow.create({
  //     data: { followerId, followingId },
  //   });
  // }

  // async unfollowUser(followerId: string, followingId: string) {
  //   await this.prisma.follow.deleteMany({ where: { followerId, followingId } });
  //   return { success: true };
  // }

  // async getFollowers(userId: string, skip = 0, take = 20) {
  //   return this.prisma.follow.findMany({
  //     where: { followingId: userId },
  //     include: { follower: true },
  //     skip,
  //     take,
  //     orderBy: { createdAt: 'desc' },
  //   });
  // }
}
