import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';
import { UserRole } from 'src/shared/database/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ===== REGISTRATION =====
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ===== LOGIN =====
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access and refresh tokens',
  })
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    return this.authService.login(loginDto, ipAddress);
  }

  // ===== LOGOUT =====
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id, req.ip);
  }

  // ===== REFRESH TOKEN =====
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  // ===== GET CURRENT USER =====
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@Request() req: any) {
    return {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      status: req.user.status,
      emailVerified: req.user.emailVerified,
      twoFactorEnabled: req.user.twoFactorEnabled,
      lastLoginAt: req.user.lastLoginAt,
    };
  }

  // ===== ADMIN ONLY ENDPOINT (Example) =====
  @Get('admin/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin dashboard (admin only)' })
  async getAdminDashboard(@Request() req: any) {
    return {
      message: 'Welcome to admin dashboard',
      userId: req.user.id,
      role: req.user.role,
    };
  }
}