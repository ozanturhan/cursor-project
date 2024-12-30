# Conversation: Modular Monolith Architecture Discussion

## Date
December 30, 2024

## Participants
- Development Team

## Context
The team discussed architectural approaches for the growing application. While initially considering Hexagonal Architecture with potential microservices, we decided to start with a simpler, more pragmatic modular monolith approach. This will provide a solid foundation while keeping the option open for future architectural evolution.

## Key Decisions

1. **Start with Modular Monolith**
   - Simpler to implement and understand
   - Easier to maintain initially
   - Clear module boundaries
   - Can evolve to microservices if needed

2. **Module Structure**
   - Each module represents a domain area (auth, booking, etc.)
   - Standard NestJS module structure
   - Clear separation between modules
   - Shared code in shared module

3. **Module Communication**
   - Event-driven communication between modules
   - Well-defined module interfaces
   - Minimal direct dependencies
   - Shared database with clear schema ownership

## Code Examples

### Module Structure Example
```typescript
// modules/auth/auth.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

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
```

## Follow-up Actions
1. Reorganize existing auth code into module structure
2. Create shared module for common functionality
3. Document module communication patterns
4. Set up event system for cross-module communication
5. Create templates for new modules

## References
- [RFC-005: Modular Monolith Architecture](../rfc/RFC-005-Modular-Monolith.md)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [Event-Driven Architecture](https://docs.nestjs.com/techniques/events)

## Notes
- Team agreed simpler approach is better to start
- Focus on getting module boundaries right
- Can consider more complex architectures later
- Need to document module creation guidelines 