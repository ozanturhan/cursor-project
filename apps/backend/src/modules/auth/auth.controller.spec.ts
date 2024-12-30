import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      userType: UserType.CLIENT,
    };

    it('should call service.register with correct data', async () => {
      await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        userType: UserType.CLIENT,
      },
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };

    it('should return login response', async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyEmail', () => {
    const verifyEmailDto = {
      token: 'validToken',
    };

    it('should call service.verifyEmail with token', async () => {
      await controller.verifyEmail(verifyEmailDto);
      expect(service.verifyEmail).toHaveBeenCalledWith(verifyEmailDto.token);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should call service.forgotPassword with email', async () => {
      await controller.forgotPassword(forgotPasswordDto);
      expect(service.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto.email);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      password: 'newPassword123',
      token: 'resetToken',
    };

    it('should call service.resetPassword with token and password', async () => {
      const token = 'validToken';
      await controller.resetPassword(token, resetPasswordDto);
      expect(service.resetPassword).toHaveBeenCalledWith(token, resetPasswordDto.password);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto = {
      refreshToken: 'validRefreshToken',
    };

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        userType: UserType.CLIENT,
      },
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    };

    it('should return new tokens', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(service.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from request', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockRequest = { user: mockUser };

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
}); 