# Identity Service – Technical Documentation

## 1. Overview

The **Identity Service** is a core backend service responsible for **authentication**, **authorization**, and **user lifecycle management** within the platform.

It is designed as an independent service so that all identity-related concerns are centralized, consistent, and secure, while remaining decoupled from business domains (such as ticketing, orders, or payments).

This service follows modern backend engineering standards:

* Stateless authentication using **JWT (Access Token + Refresh Token)**
* Role-Based Access Control (**RBAC**)
* Clean Architecture / Hexagonal Architecture
* Explicit separation between **API layer**, **application use cases**, and **domain logic**
* Fully documented and discoverable through **Swagger / OpenAPI**

The API documentation described below represents the **external contract** of the service — everything that client applications or other services need in order to integrate with it.

---

## 2. API Documentation (External Interface)

This section describes how to **consume the Identity Service API**.

### Base URL

```
http://localhost:3000
```

> The base URL may vary depending on the environment (development, staging, production).

---

## 3. Authentication

### Authentication Model

The Identity Service uses **Bearer Token authentication** based on JWT.

* **Access Token**: Short-lived token used to authenticate API requests
* **Refresh Token**: Long-lived token used to obtain a new access token

Protected endpoints require the following HTTP header:

```
Authorization: Bearer <access_token>
```

Refresh tokens are stored server-side and can be **explicitly invalidated** (logout), enabling secure session management.

---

## 4. Authentication Endpoints

### POST /auth/register

**Register a new user**

Creates a new user account with the provided credentials.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "role": "ADMIN"
}
```

#### Responses

* **201 Created** – User successfully registered
* **400 Bad Request** – Validation error or invalid data
* **409 Conflict** – Email already registered

#### Example Response

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "status": "ACTIVE"
}
```

---

### POST /auth/login

**Authenticate user and generate tokens**

Validates user credentials and returns authentication tokens.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

#### Responses

* **200 OK** – Authentication successful
* **401 Unauthorized** – Invalid credentials

#### Example Response

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

---

### POST /auth/refresh

**Refresh access token**

Generates a new access token using a valid refresh token.

#### Request Body

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### Responses

* **200 OK** – New access token generated
* **401 Unauthorized** – Invalid or expired refresh token

#### Example Response

```json
{
  "accessToken": "new-jwt-access-token"
}
```

---

### POST /auth/logout

**Logout user and invalidate refresh token**

Explicitly invalidates the refresh token, terminating the session.

#### Request Body

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### Responses

* **204 No Content** – Logout successful
* **400 Bad Request** – Invalid token

---

### GET /auth/me

**Get authenticated user information**

Returns information about the currently authenticated user.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Responses

* **200 OK** – User data returned
* **401 Unauthorized** – Missing or invalid access token

#### Example Response

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "status": "ACTIVE"
}
```

---

## 5. Users (Administrative Management)

All endpoints in this section require:

* Valid authentication
* **ADMIN role**

---

### GET /users

**List all users**

Returns a list of registered users.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Responses

* **200 OK** – List of users
* **403 Forbidden** – Insufficient permissions

#### Example Response

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "status": "ACTIVE"
  }
]
```

---

### GET /users/{id}

**Get user details by ID**

#### Path Parameters

* `id` (string, UUID) – User identifier

#### Responses

* **200 OK** – User found
* **404 Not Found** – User does not exist

---

### PATCH /users/{id}/activate

**Activate a user**

Transitions a user to the ACTIVE state.

#### Responses

* **204 No Content** – User activated
* **404 Not Found** – User not found
* **409 Conflict** – Invalid state transition

---

### PATCH /users/{id}/suspend

**Suspend a user**

Transitions a user to the SUSPENDED state.

#### Responses

* **204 No Content** – User suspended
* **404 Not Found** – User not found
* **409 Conflict** – Invalid state transition

---

## 6. HTTP Status Codes Summary

| Status Code      | Meaning                                  |
| ---------------- | ---------------------------------------- |
| 200 OK           | Successful request                       |
| 201 Created      | Resource successfully created            |
| 204 No Content   | Successful request with no response body |
| 400 Bad Request  | Invalid request data                     |
| 401 Unauthorized | Authentication failed                    |
| 403 Forbidden    | Insufficient permissions                 |
| 404 Not Found    | Resource not found                       |
| 409 Conflict     | Business rule violation                  |

---

## 7. Swagger / OpenAPI

The Identity Service exposes an **interactive API documentation** using Swagger.

This documentation is automatically generated from the codebase and always reflects the current API contract.

Swagger provides:

* Live endpoint testing
* Request/response schema visualization
* Authentication support via Bearer tokens

This ensures the API remains **self-documented**, **discoverable**, and **safe to evolve** over time.

---

## 8. Configuration and Quick Start Guide (Getting Started)

Essential for new developers working on the project.

### Prerequisites

- **Node.js**: Latest stable version (2026 recommended)
- **Package Manager**: npm or Yarn (pnpm is used in this project)
- **Docker**: Required for running databases and message queues

### Installation and Setup

```bash

# Start all services using Docker (recommended)
docker compose -f infra/docker/docker-compose.yml build
docker compose -f infra/docker/docker-compose.yml up -d

# Install all dependencies
pnpm install
# Run the service locally (alternative)
pnpm exec tsx --env-file=apps/identity-service/src/.env apps/identity-service/src/main.ts
```

### Environment Variables

Create a `.env` file in `apps/identity-service/src/` with the following variables:

```env
# Database
DATABASE_URL=

# Server
PORT=
NODE_ENV=

# Message Queue
RABBITMQ_URL=a

# JWT Secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# Redis
REDIS_PORT=
REDIS_HOST=
```

For testing, create `.env.test` with:

```env
NODE_ENV=test
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
```

> **Note**: Using Docker is recommended as NX has many abstraction layers that may require additional setup on your machine.

---

## 9. Technical Details and Architecture

This section explains the "why" behind design decisions.

### Folder Structure

The project follows Clean Architecture principles with clear separation of concerns:

```
identity-service/
├── src/
│   ├── application/     # Use cases and business logic
│   ├── domain/         # Entities, value objects, domain services
│   ├── infrastructure/ # External implementations (DB, cache, http, etc.)
│   
│   
│   
```

### Authentication Flow

The service implements stateless authentication using JWT tokens:

1. **Login**: Validates credentials → Issues Access Token (15min) + Refresh Token (7 days)
2. **Protected Routes**: Require `Authorization: Bearer <access_token>` header
3. **Token Refresh**: Uses refresh token to obtain new access token
4. **Logout**: Server-side refresh token invalidation

Protected routes include all `/users/*` endpoints (ADMIN role required) and `/auth/me`.

### Technology Stack

- **Database**: PostgreSQL (primary data store)
- **Cache**: Redis (refresh token storage, session management)
- **Message Queue**: RabbitMQ (event-driven communication)
- **Authentication**: JWT with access/refresh token pattern
- **Framework**: Node.js with TypeScript
- **Architecture**: Clean/Hexagonal Architecture with Domain-Driven Design principles

---

## 10. Operation and Best Practices (2026 Context)

### Monitoring and Logs

The service tracks key metrics for observability:

- **Latency**: API response times (p95, p99 percentiles)
- **Error Rates**: HTTP error code distribution
- **Throughput**: Requests per minute
- **Database Metrics**: Query performance, connection pool usage

Logs are structured (JSON format) and can be consulted through:
- Application logs (stdout/stderr)
- Centralized logging system (when deployed)
- Docker container logs: `docker logs <container_name>`

### Security Measures

Multiple layers of security are implemented:

1. **SQL Injection Protection**: Parameterized queries via ORM
2. **DOS Protection**: Rate limiting middleware on authentication endpoints
3. **Input Validation**: Request validation using Zod schemas
4. **CORS**: Strict CORS policies in production
5. **Helmet.js**: Security headers middleware
6. **JWT Best Practices**: Short-lived access tokens, secure refresh token storage

### Testing

```bash
# Create test database (required before integration tests)
docker exec -it online_ticket_postgres psql -U identity_user -d postgres -c "CREATE DATABASE identity_test;"

# Run unit tests
pnpm nx test identity-service

# Run integration tests
pnpm run test:e2e
```

### Maintenance

**Dependency Updates**:
- Regular `pnpm update` to keep dependencies current
- Security patches applied immediately
- Major version updates tested in staging first

**Code Quality**:
- Static analysis using ESLint and TypeScript compiler
- Pre-commit hooks for code formatting (Prettier)
- Regular dependency vulnerability scanning

**Database Migrations**:
- Managed through migration scripts
- Rollback procedures documented
- Backup strategy in place for production data