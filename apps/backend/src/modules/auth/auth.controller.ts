import { Body, Controller, Post, Get, Query, UseGuards, Request, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponse, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: { user: any }) {
    return req.user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 201, description: 'User successfully logged in', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 201, description: 'Email successfully verified' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid or expired token' })
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 201, description: 'Password reset email sent' })
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 201, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid or expired token' })
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 201, description: 'Tokens successfully refreshed', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid refresh token' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get('check-username/:username')
  @ApiOperation({ summary: 'Check username availability' })
  @ApiResponse({ status: 200, description: 'Returns true if username is available' })
  async checkUsername(@Param('username') username: string): Promise<{ isAvailable: boolean }> {
    const isAvailable = await this.authService.checkUsername(username);
    return { isAvailable };
  }
} 