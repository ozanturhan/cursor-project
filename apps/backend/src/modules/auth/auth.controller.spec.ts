import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: '$2b$10$test',
    fullName: 'Test User',
    roles: [{ id: '1', userId: '1', role: Role.CLIENT, createdAt: new Date(), updatedAt: new Date() }],
    emailVerified: null,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockUser),
            login: jest.fn().mockResolvedValue({
              user: mockUser,
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    };

    it('should register a new user', async () => {
      const result = await controller.register(registerDto);
      expect(result).toEqual(mockUser);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const result = await controller.login(loginDto);
      expect(result).toEqual({
        user: mockUser,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
}); 