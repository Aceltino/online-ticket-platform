# Online Ticket Platform – Backend Workspace

## Services Documentations
**Identity Service** → [Detailed Documentation](https://github.com/Aceltino/online-ticket-platform/blob/main/apps/identity-service/readme.md)
---

## 1. Platform Overview

The **Online Ticket Platform** is a modular backend system designed to support a scalable, event-driven, and service-oriented architecture.

The platform is composed of **independent backend services**, each owning a specific business capability, while sharing common infrastructure standards such as authentication, messaging, and observability.

This workspace is structured as a **monorepo** to:

- Encourage consistency across services
- Enable shared tooling and standards
- Simplify local development and CI pipelines
- Preserve clear service boundaries

---

## 2. High-Level Architecture

The platform follows a **Service-Oriented Architecture** with strong domain boundaries.

```text
Client Applications
        |
        v
   API Gateway (future)
        |
        v
+------------------------+
|    Identity Service    |
|  (Auth & Users)        |
+------------------------+
        |
        | UserCreated Event
        v
+------------------------+
|   Other Services       |
| (Profile, Orders, ...) |
+------------------------+
```

**Architectural Principles**
- Single Responsibility per Service
- Explicit boundaries between domains
- Stateless services
- Event-driven communication
- Infrastructure isolated from business logic

---

## 3. Services in This Workspace

### 🧩 Identity Service
**Responsibility**
- Authentication
- Authorization (RBAC)
- User lifecycle management

**Key Concepts**
- JWT Access & Refresh Tokens
- Redis-backed refresh token invalidation
- Admin-only user management
- Domain-driven validation

**📄 Documentation:** `apps/identity-service/README.md`

### 🔮 Future Services (Planned)
- **Profile Service** – User profiles and preferences
- **Ticket Service** – Ticket creation and validation
- **Order Service** – Purchases and payments
- **Notification Service** – Emails, SMS, push notifications

Each service will:
- Own its database
- Expose a public API
- Subscribe to domain events

---

## 4. Inter-Service Communication

The platform is designed around event-driven communication.

**Messaging Strategy**
- RabbitMQ is used as the message broker
- Services emit domain events (e.g. UserCreated)
- Other services subscribe and react asynchronously

This approach provides:
- Loose coupling
- Horizontal scalability
- Failure isolation

No service directly queries another service's database.

---

## 5. Technology Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Runtime | Node.js (LTS) |
| Framework | Express |
| Database | PostgreSQL |
| Cache | Redis |
| Messaging | RabbitMQ |
| Auth | JWT (Access & Refresh Tokens) |
| API Docs | Swagger / OpenAPI |
| Monorepo Tooling | Nx |
| Containers | Docker / Docker Compose |
| Testing | Jest, Supertest |

---

## 6. Workspace Structure

```
.
├── apps/
│   ├── identity-service/
│   └── ...
│
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml
│   └── scripts/
│
├── libs/
│   └── shared utilities (future)
│
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 7. Running the Platform

**Recommended Approach (Docker)**
```bash
# Start all infrastructure services
docker compose -f infra/docker/docker-compose.yml build
docker compose -f infra/docker/docker-compose.yml up -d
```

This starts:
- PostgreSQL
- Redis
- RabbitMQ
- All backend services

---

## 8. Testing Strategy (Workspace Level)

**Unit Tests**
```bash
pnpm nx test identity-service
```

**Integration / E2E Tests**
```bash
# Create test database first
docker exec -it online_ticket_postgres psql -U identity_user -d postgres -c "CREATE DATABASE identity_test;"

# Run integration tests
pnpm run test:e2e
```

Each service maintains:
- Domain & use case unit tests
- Route-level integration tests

---

## 9. Architectural Decisions

- JWT + Refresh Tokens for stateless authentication
- Redis for immediate session invalidation
- Outbox / Event Dispatcher for domain events
- Clean Architecture to isolate business rules
- Swagger-first API design

These decisions aim to balance:
- Developer productivity
- System scalability
- Long-term maintainability

---

## 10. Roadmap

**Planned improvements:**
- API Gateway
- Centralized observability
- Distributed tracing
- Service-to-service authentication
- CI/CD pipelines per service

---

## 11. Identity Service – API Documentation

### Overview

The **Identity Service** is a core backend service responsible for **authentication**, **authorization**, and **user lifecycle management** within the platform.

It is designed as an independent service so that all identity-related concerns are centralized, consistent, and secure, while remaining decoupled from business domains (such as ticketing, orders, or payments).

### Base URL
```
http://localhost:3000
```

> The base URL may vary depending on the environment (development, staging, production).

---

## 12. Authentication

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

## 13. Authentication Endpoints in - Identity Service


## 14. Users (Administrative Management) in - Identity Service

---

## 15. HTTP Status Codes Summary

| Status Code | Meaning |
|-------------|---------|
| 200 OK | Successful request |
| 201 Created | Resource successfully created |
| 204 No Content | Successful request with no response body |
| 400 Bad Request | Invalid request data |
| 401 Unauthorized | Authentication failed |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource not found |
| 409 Conflict | Business rule violation |

---

## 16. Configuration and Quick Start Guide

### Prerequisites
- **Node.js**: Latest stable version (2026 recommended)
- **Package Manager**: pnpm (primary), npm or Yarn
- **Docker**: Required for running databases and message queues

### Installation and Setup
```bash
# Install all dependencies
pnpm install

# Start all services using Docker (recommended)
docker compose -f infra/docker/docker-compose.yml build
docker compose -f infra/docker/docker-compose.yml up -d

---

## 17. Operation and Best Practices

### Monitoring and Logs
The service tracks key metrics:
- **Latency**: API response times (p95, p99 percentiles)
- **Error Rates**: HTTP error code distribution
- **Throughput**: Requests per minute
- **Database Metrics**: Query performance, connection pool usage

Logs are structured (JSON format) and can be consulted through:
- Application logs (stdout/stderr)
- Centralized logging system (when deployed)
- Docker container logs: `docker logs <container_name>`

### Security Measures
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

---

## 18. Swagger / OpenAPI

The Identity Service exposes an **interactive API documentation** using Swagger.

This documentation is automatically generated from the codebase and always reflects the current API contract.

Swagger provides:
- Live endpoint testing
- Request/response schema visualization
- Authentication support via Bearer tokens

This ensures the API remains **self-documented**, **discoverable**, and **safe to evolve** over time.
