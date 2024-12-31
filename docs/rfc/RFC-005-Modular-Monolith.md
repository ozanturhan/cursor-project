# RFC 005: Modular Monolith Architecture

## Status
Proposed

## Context
As the application grows with multiple domains (auth, booking, profiles, etc.), we need a clean and maintainable architecture. While microservices might be considered in the future, starting with a well-structured modular monolith will provide a better foundation and easier path to potential future decomposition.

## Decision
We will implement a modular monolith architecture that:
1. Separates different domain modules clearly
2. Maintains high cohesion within modules
3. Defines clear boundaries and interfaces between modules
4. Allows for potential future decomposition into microservices

## Proposed Structure
```
src/
├── modules/              # Domain modules
│   ├── auth/            # Authentication module
│   │   ├── entities/    # Auth domain models
│   │   ├── dtos/       # Data transfer objects
│   │   ├── services/   # Business logic
│   │   ├── controllers/# HTTP endpoints
│   │   └── auth.module.ts
│   │
│   ├── booking/         # Booking module
│   │   ├── entities/
│   │   ├── dtos/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── booking.module.ts
│   │
│   └── profile/         # Profile module
│       ├── entities/
│       ├── dtos/
│       ├── services/
│       ├── controllers/
│       └── profile.module.ts
│
├── shared/              # Shared code
│   ├── config/         # Configuration
│   ├── database/       # Database setup
│   ├── exceptions/     # Common exceptions
│   ├── guards/         # Auth guards
│   └── utils/          # Utilities
│
└── app.module.ts        # Root module
```

## Example Implementation

### Auth Module
```typescript
// modules/auth/entities/user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  emailVerified: boolean;
}

// modules/auth/services/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    // Implementation
  }
}

// modules/auth/controllers/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<void> {
    return this.authService.register(dto);
  }
}
```

### Module Communication
```typescript
// modules/auth/events/user-registered.event.ts
export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}

// modules/profile/services/profile.service.ts
@Injectable()
export class ProfileService {
  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    await this.createInitialProfile(event.userId);
  }
}
```

## Module Guidelines

1. **Module Independence**
   - Each module should be self-contained
   - Minimal dependencies between modules
   - Clear public interfaces

2. **Module Structure**
   - Consistent structure across modules
   - Clear separation of concerns
   - Module-specific business logic

3. **Communication**
   - Use events for cross-module communication
   - Well-defined interfaces between modules
   - Avoid direct imports from other modules

## Benefits
1. **Maintainability**
   - Clear module boundaries
   - Easier to understand and modify
   - Localized changes

2. **Development Scalability**
   - Multiple teams can work on different modules
   - Independent module deployment possible
   - Clear ownership

3. **Future-Proof**
   - Easy to identify microservice boundaries
   - Can split modules into services later
   - Good foundation for scaling

## Migration Strategy
1. **Phase 1: Module Structure**
   - Set up basic module structure
   - Move existing auth code to auth module
   - Establish module patterns

2. **Phase 2: Additional Modules**
   - Create booking and profile modules
   - Implement module communication
   - Refine shared components

3. **Phase 3: Refinement**
   - Review module boundaries
   - Optimize module interactions
   - Document patterns

## Open Questions
1. How to handle shared database access?
2. What belongs in shared vs modules?
3. How to handle module-specific configurations?

## References
- [NestJS Modules](https://docs.nestjs.com/modules)
- [Modular Monolith: A Primer](https://www.kamilgrzybek.com/design/modular-monolith-primer/)
- [Event-Driven Architecture](https://docs.nestjs.com/techniques/events)
- [CONVERSATION-008: Modular Monolith Discussion](../conversations/CONVERSATION-008-Modular-Monolith-Discussion.md) 