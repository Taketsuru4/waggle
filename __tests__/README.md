# Waggle Unit Tests

This directory contains comprehensive unit tests for the Waggle pet sitting platform.

## Test Setup

The test suite uses:
- **Vitest** - Fast unit test framework for Vite projects
- **@testing-library/react** - Testing utilities for React components
- **happy-dom** - Lightweight DOM implementation for testing

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Structure

### 1. Authentication Tests (`auth.test.ts`)
Tests user signup and sign-in functionality with role assignment:
- ✅ Sign up with different roles (owner, caregiver, both)
- ✅ Role persistence to profiles table
- ✅ Email confirmation requirements
- ✅ Sign-in with valid/invalid credentials
- ✅ Error handling for authentication failures

**Coverage:** 9 tests

### 2. Caregiver Profile Tests (`caregiver-profile.test.ts`)
Tests caregiver profile creation and updates with role management:
- ✅ Create caregiver profile with complete data
- ✅ Role updates (owner → both, new → caregiver)
- ✅ Pet type acceptance parsing (dogs, cats, birds, rabbits, other)
- ✅ Update profile data including availability
- ✅ Authorization checks
- ✅ Error handling

**Coverage:** 11 tests

### 3. Pet Profile Tests (`pet-profile.test.ts`)
Tests CRUD operations for pet profiles with authorization:
- ✅ Create pets with complete/partial data
- ✅ Update pet information
- ✅ Delete pets
- ✅ Owner authorization enforcement on all operations
- ✅ Numeric field parsing (age, weight)
- ✅ Optional field handling
- ✅ Error handling for unauthorized access

**Coverage:** 15 tests

### 4. Booking Lifecycle Tests (`booking-lifecycle.test.ts`)
Tests the complete booking flow with role-based authorization:
- ✅ Create bookings with date validation
- ✅ Accept bookings (caregiver only)
- ✅ Decline bookings (caregiver only)
- ✅ Cancel bookings (owner only)
- ✅ Complete bookings (owner or caregiver)
- ✅ Role-based authorization for each action
- ✅ Full lifecycle scenarios (create → accept → complete)
- ✅ Error handling and edge cases

**Coverage:** 24 tests

### 5. Caregiver Search Tests (`caregiver-search.test.ts`)
Tests search and filter functionality with various criteria:
- ✅ Filter by availability
- ✅ Filter by city (exact and partial matches, case-insensitive)
- ✅ Filter by pet type (dogs, cats, birds, rabbits, other)
- ✅ Filter by price range (min, max, or both)
- ✅ Text search in city or bio
- ✅ Combined filters (multiple criteria simultaneously)
- ✅ Result ordering (by created_at descending)
- ✅ Error handling
- ✅ Edge cases (empty strings, undefined values)

**Coverage:** 25 tests

## Total Coverage

**84 tests across 5 test suites** covering:
1. Authentication and role assignment
2. Caregiver profile management
3. Pet profile CRUD operations
4. Booking lifecycle with role-based authorization
5. Search and filter functionality

## Test Utilities

### Supabase Mock (`utils/supabase-mock.ts`)
Provides a comprehensive mock of the Supabase client for testing:
- Mock authentication methods (signUp, signIn, getUser, signOut)
- Mock database operations (from, select, insert, update, delete)
- Mock query builders (eq, ilike, or, gte, lte, order, single)

The mock is designed to be flexible and handle complex query chains.

## Key Testing Patterns

### 1. Authorization Testing
All operations that modify data verify:
- User authentication (returns "Unauthorized" if not logged in)
- Resource ownership (users can only modify their own data)
- Role-based permissions (caregivers vs owners)

### 2. Data Validation
Tests verify:
- Required fields are present
- Optional fields handle null/undefined correctly
- Numeric fields are parsed properly
- Date validation (e.g., end date > start date)

### 3. Error Handling
Tests verify graceful handling of:
- Database errors
- Invalid input
- Missing resources
- Unauthorized access attempts

### 4. Mocking Strategy
Tests use:
- Isolated Supabase client mocks per test
- Proper mock chaining for query builders
- Realistic error responses
- Clean setup/teardown with `beforeEach`

## Next.js Integration

Tests account for Next.js server actions:
- Mocks `next/cache` revalidatePath
- Mocks `next/navigation` redirect (expects NEXT_REDIRECT error)
- Tests use try/catch for redirect flows

## Continuous Integration

To run tests in CI/CD:
```bash
npm ci
npm run test:run
```

All tests should pass before merging PRs.

## Adding New Tests

When adding new features:
1. Create test file in `__tests__` directory
2. Import and use `createMockSupabaseClient` from utils
3. Mock Supabase server client at module level
4. Use `beforeEach` for clean test setup
5. Test success cases, error cases, and edge cases
6. Verify authorization for protected operations
7. Run `npm run format` before committing

## Notes

- Console errors in test output are expected for error-handling tests
- Tests are isolated and don't affect each other
- Mocks are reset between tests using `vi.clearAllMocks()`
