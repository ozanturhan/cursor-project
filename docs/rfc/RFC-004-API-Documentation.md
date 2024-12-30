# RFC 004: API Documentation and Standards

## Status
- [x] Proposed
- [x] Accepted
- [x] Implemented (Swagger/OpenAPI)
- [ ] Complete

## Summary
This RFC outlines the API documentation strategy, standards, and tooling for the consultation platform, ensuring consistent and well-documented APIs across all services.

## Background
As the platform grows, maintaining clear and up-to-date API documentation becomes crucial for both internal development and potential future integrations. This RFC establishes standards for API documentation and introduces tooling to automate and maintain this documentation.

## Detailed Design

### Documentation Tools
1. Swagger/OpenAPI Integration
   - Interactive API documentation at `/api`
   - OpenAPI specification at `/api-json`
   - Automated spec generation
   - Example requests and responses
   - Authentication flow documentation
   - Rate limiting information

### API Standards
1. Endpoint Naming Conventions
   - RESTful resource naming
   - Consistent URL structure
   - Version prefix when needed
   - Clear action naming

2. Request/Response Standards
   - Consistent error response format
   - Standard success response structure
   - Proper HTTP status code usage
   - Content-Type requirements

3. Documentation Requirements
   - Endpoint descriptions
   - Parameter documentation
   - Response schema documentation
   - Authentication requirements
   - Rate limiting information
   - Example requests/responses

### Implementation Details
```typescript
// Standard error response
interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: any;
}

// Standard success response
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

### Versioning Strategy
1. URL-based versioning (e.g., `/v1/auth/login`)
2. Version deprecation process
3. Documentation for version differences
4. Migration guides

## Testing Strategy
1. Documentation testing
   - Validate OpenAPI spec
   - Check example validity
   - Verify endpoint accessibility
2. Integration tests for documentation endpoints
3. Automated documentation updates

## Implementation Phases
1. Basic Setup
   - [x] Swagger/OpenAPI integration
   - [x] Basic endpoint documentation
   - [x] Authentication documentation

2. Enhanced Documentation
   - [ ] Complete endpoint documentation
   - [ ] Example requests/responses
   - [ ] Error documentation
   - [ ] Rate limiting documentation

3. Advanced Features
   - [ ] API client generation
   - [ ] Documentation testing
   - [ ] Version management
   - [ ] Migration guides

## Security Considerations
1. Sensitive information in documentation
2. Authentication for documentation access
3. Rate limiting for documentation endpoints
4. Environment-specific documentation

## Timeline
- [x] Initial Swagger setup
- [x] Basic endpoint documentation
- [ ] Complete documentation coverage
- [ ] API client generation
- [ ] Documentation testing
- [ ] Version management

## References
- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [API Documentation Best Practices](https://swagger.io/blog/api-documentation/best-practices-in-api-documentation/) 