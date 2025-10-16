import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from 'src/shared/database/entities/user.entity';
import { RegisterDto } from '../dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const user = this.usersRepository.create({
      email: registerDto.email,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
      status: UserStatus.PENDING_VERIFICATION,
      role: UserRole.EMPLOYEE,
    });

    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
      },
    );
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    const user = await this.findById(userId);
    const attempts = (user.failedLoginAttempts || 0) + 1;

    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      const lockedUntil = new Date();
      lockedUntil.setHours(lockedUntil.getHours() + 1);

      await this.usersRepository.update({ id: userId }, {
        failedLoginAttempts: attempts,
        status: UserStatus.LOCKED,
        lockedUntil,
      });
    } else {
      await this.usersRepository.update({ id: userId }, {
        failedLoginAttempts: attempts,
      });
    }
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    );
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: UserStatus.ACTIVE,
      },
    );
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    await this.usersRepository.update({ id: userId }, { role });
    return this.findById(userId);
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      {
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
      },
    );
  }
}