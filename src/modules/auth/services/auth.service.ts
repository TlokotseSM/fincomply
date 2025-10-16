import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from 'src/shared/database/entities/user.entity';
import { UsersService } from './users.service';
import { RegisterDto, LoginDto, RefreshTokenDto, TokenPayloadDto } from '../dto/auth.dto';
import { AuditLogService } from '../../audit/audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditLogService: AuditLogService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ===== REGISTRATION =====
  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.create(registerDto);

    await this.auditLogService.log({
      userId: user.id,
      action: 'USER_REGISTERED',
      entity: 'user',
      entityId: user.id,
      details: { email: user.email, username: user.username },
      status: 'success',
    });

    // In production, send email verification link
    const emailVerificationToken = this.generateEmailVerificationToken(user.id);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      message: 'Registration successful. Please verify your email.',
      // In production, include this in email: verification_url: `${baseUrl}/auth/verify-email?token=${emailVerificationToken}`
    };
  }

  // ===== LOGIN =====
  async login(loginDto: LoginDto, ipAddress: string) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      await this.auditLogService.log({
        userId: null,
        action: 'LOGIN_FAILED',
        entity: 'auth',
        entityId: loginDto.email,
        details: { reason: 'User not found' },
        status: 'failed',
        ipAddress,
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      await this.auditLogService.log({
        userId: user.id,
        action: 'LOGIN_FAILED',
        entity: 'auth',
        entityId: user.id,
        details: { reason: 'Account locked' },
        status: 'failed',
        ipAddress,
      });
      throw new UnauthorizedException('Account is locked. Try again later.');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      await this.usersService.incrementFailedLoginAttempts(user.id);

      await this.auditLogService.log({
        userId: user.id,
        action: 'LOGIN_FAILED',
        entity: 'auth',
        entityId: user.id,
        details: { reason: 'Invalid password' },
        status: 'failed',
        ipAddress,
      });

      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account can login
    if (!user.canLogin()) {
      await this.auditLogService.log({
        userId: user.id,
        action: 'LOGIN_FAILED',
        entity: 'auth',
        entityId: user.id,
        details: { reason: 'Account not active', status: user.status },
        status: 'failed',
        ipAddress,
      });

      throw new UnauthorizedException(`Account is ${user.status}`);
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && !loginDto.twoFactorCode) {
      await this.auditLogService.log({
        userId: user.id,
        action: 'LOGIN_2FA_REQUIRED',
        entity: 'auth',
        entityId: user.id,
        status: 'pending',
        ipAddress,
      });

      return {
        twoFactorRequired: true,
        userId: user.id,
        message: 'Two-factor authentication required',
      };
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    await this.auditLogService.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entity: 'auth',
      entityId: user.id,
      details: { email: user.email },
      status: 'success',
      ipAddress,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      ...tokens,
    };
  }

  // ===== LOGOUT =====
  async logout(userId: string, ipAddress: string) {
    await this.auditLogService.log({
      userId,
      action: 'LOGOUT',
      entity: 'auth',
      entityId: userId,
      status: 'success',
      ipAddress,
    });

    // In production, add refresh token to blacklist
    return { message: 'Logged out successfully' };
  }

  // ===== TOKEN REFRESH =====
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET') || 'your-refresh-secret-key',
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ===== TOKEN GENERATION =====
  private generateTokens(user: User) {
    const payload: TokenPayloadDto = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'your-secret-key',
      expiresIn: '15m',
    });

    const refreshPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800, // 7 days
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'your-refresh-secret-key',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer',
    };
  }

  private generateEmailVerificationToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'email-verification' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '24h',
      },
    );
  }
}