import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export class AuthService {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
      omit: { password: true } as any,
    });
  }

  async createUser(email: string, password: string, displayName: string) {
    const hashedPassword = hashPassword(password);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            displayName,
            examType: 'SAT',
            subjects: [],
            subscriptionTier: 'free',
          },
        },
        streak: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
            freezesAvailable: 2,
            freezesUsed: 0,
          },
        },
      },
      include: { profile: true },
    });
  }

  async validatePassword(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) return null;

    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      examType?: string;
      subjects?: string[];
      examDate?: Date;
    }
  ) {
    return prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        displayName: '',
        examType: data.examType ?? 'SAT',
        subjects: data.subjects ?? [],
        subscriptionTier: 'free',
      },
    });
  }
}
