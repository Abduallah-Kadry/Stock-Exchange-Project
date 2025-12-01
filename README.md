# 📈 Stock Exchange Management System

<div align="center">

[![Java](https://img.shields.io/badge/Java-17-3178C6?style=for-the-badge&logo=openjdk&logoColor=white)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.8-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jib](https://img.shields.io/badge/Container-Jib-4285F4?style=for-the-badge&logo=docker&logoColor=white)](https://github.com/GoogleContainerTools/jib)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://github.com/jwtk/jjwt)

**A modern, production-ready Stock Exchange Management System with real-time trading capabilities**

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

---

</div>

## 🌟 Overview

A full-stack, enterprise-grade stock trading platform featuring real-time market data, secure authentication, and comprehensive portfolio management. Built with Spring Boot backend and Next.js frontend, containerized using Google Jib (backend) and Docker (frontend).

### ✨ What Makes This Special

- **Production Ready** - Built with enterprise patterns, security best practices, and comprehensive testing
- **Containerized with Jib** - Backend uses Google Jib for fast, daemon-less Docker builds
- **Type Safe** - Full TypeScript coverage on frontend with Zod validation
- **Secure by Design** - JWT authentication with HttpOnly cookies, BCrypt hashing, role-based access
- **Well Architected** - Clean separation of concerns, auditing, versioning, and optimistic locking
- **Developer Friendly** - OpenAPI/Swagger docs, MapStruct DTOs, Spring Actuator monitoring

---

## 🚀 Key Features

### 🔐 Security & Authentication

- **JWT-based Authentication**
    - Token delivery via `Authorization: Bearer <token>` header OR HttpOnly cookie
    - BCrypt password hashing
    - Stateless sessions for horizontal scalability
    - Custom JWT authentication filter

- **Role-Based Access Control (RBAC)**
    - `ROLE_USER` - Standard trading operations
    - Method-level security with `@PreAuthorize`
    - First registered user automatically receives admin role

- **Security Best Practices**
    - CSRF protection (disabled for stateless API)
    - Centralized exception handling
    - Input validation at all entry points

### 📊 Trading & Portfolio Management

- **Stock Exchange Management**
    - Multiple exchange support
    - Live market status tracking
    - Exchange-specific stock listings
    - Bulk stock operations (add/remove multiple stocks)

### 📈 Data Management

- **JPA Entities with Advanced Features**
    - Optimistic locking with `@Version`
    - Audit trails with `@EnableJpaAuditing`
    - Composite keys for junction tables
    - Custom repository queries with pagination

### 🛠 Developer Experience

- **OpenAPI Documentation**
    - Interactive Swagger UI at `/swagger-ui.html`
    - Complete API specs at `/v3/api-docs`
    - Request/response examples

- **Monitoring & Health**
    - Spring Boot Actuator endpoints
    - Health checks at `/actuator/health`
    - Application info at `/actuator/info`

- **Code Quality**
    - MapStruct for clean DTO mapping
    - Jakarta Validation for request validation
    - Comprehensive test coverage (JUnit 5, Mockito)

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Backend
- **Framework:** Spring Boot 3.5.8
- **Language:** Java 17
- **Security:** Spring Security + JWT (JJWT 0.12.6)
- **Database:** H2 (dev)
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven
- **Containerization:** Google Jib 3.4.0
- **API Documentation:** Springdoc OpenAPI 2.x
- **Object Mapping:** MapStruct 1.6.3
- **Testing:** JUnit 5, Mockito, Spring Security Test
- **Monitoring:** Spring Boot Actuator

</td>
<td width="50%" valign="top">

### Frontend
- **Framework:** Next.js 16.0.3
- **Language:** TypeScript 5.0
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Components:** Radix UI, Shadcn/ui
- **State Management:** React Context API, TanStack Query
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Notifications:** Sonner
- **Icons:** Lucide React, Heroicons
- **Containerization:** Docker (Multi-stage)

</td>
</tr>
</table>

### DevOps & Tools
- **Containerization:** Docker Compose orchestration
- **Backend Build:** Google Jib (daemon-less containerization)
- **Frontend Build:** Dockerfile (optimized multi-stage build)
- **Version Control:** Git
- **API Testing:** Postman
---

## 🗄️ Data Model

### JPA Entities

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    Stock     │         │  StockListing    │         │StockExchange │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ stockId (PK) │────────>│ stockId (FK)     │<────────│exchangeId(PK)│
│ name         │         │ exchangeId (FK)  │         │ name         │
│ description  │         │ [composite PK]   │         │ description  │
│ currentPrice │         └──────────────────┘         │ liveInMarket │
│ updatedAt    │                                       │ version      │
│ version      │                                       └──────────────┘
└──────────────┘

┌──────────────┐
│     User     │
├──────────────┤
│ userId (PK)  │
│ username     │
│ email        │
│ password     │
│ authorities  │
│ createdAt    │
│ updatedAt    │
│ createdBy    │
│ updatedBy    │
│ version      │
└──────────────┘
```

### Entity Details

**Stock**
- Primary Key: `stockId`
- Optimistic locking: `version`
- Fields: name, description, currentPrice, updatedAt
- Relationships: One-to-many `stockListings`

**StockExchange**
- Primary Key: `stockExchangeId`
- Optimistic locking: `version`
- Fields: name, description, liveInMarket (boolean)
- Relationships: One-to-many `stockListings`

**StockListing** (Junction Table)
- Composite Primary Key: `StockListingId` (exchangeId + stockId)
- Links stocks to exchanges (many-to-many)

**User**
- Primary Key: `userId`
- Auditing: createdAt, updatedAt, createdBy, updatedBy
- Optimistic locking: `version`
- Authorities stored via `@ElementCollection`
- Password hashed with BCrypt

### Database Configuration

**Development:** H2 file database
- Location: `./data/stockexchangedb`
- Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/stockexchangedb`
- Bootstrap: `schema.sql` and `data.sql` in resources

---


## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Java 17+** ([Download](https://adoptium.net/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Maven 3.8+** (or use included wrapper)
- **Docker & Docker Compose** (Optional but recommended, [Download](https://www.docker.com/))

### Option 1: Docker Compose (Recommended) 🐳

The fastest way to get started. Backend builds with **Google Jib** (no Docker daemon needed for build), frontend uses **multi-stage Dockerfile**:

```bash
# Clone the repository
git clone https://github.com/Abdullah-Ebrahim-Othman/Stock-Exchange-Case.git
cd Stock-Exchange-Case

cd backend
mvn clean package
mvn jib:dockerBuild

# Build and start all services
# Jib builds backend image, Dockerfile builds frontend
cd frontend
npm install

docker-compose up --build -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- API Documentation: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console
- Health Check: http://localhost:8080/actuator/health

**Manage services:**
```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend
```


**Backend Environment Variables:**

```properties
# Spring Profile
SPRING_PROFILES_ACTIVE=dev

# Database (H2 for dev)
SPRING_DATASOURCE_URL=jdbc:h2:file:./data/stockexchangedb
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver

# JWT Configuration
JWT_SECRET=your-base64-encoded-secret-key-min-256-bits
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```


**Frontend Environment Variables:**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# App Configuration
NEXT_PUBLIC_APP_NAME=Stock Exchange
```

---

## 📚 API Documentation

Base URL: `/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/auth/register` | Register new user | No | - |
| POST | `/auth/login` | User login (sets HttpOnly cookie) | No | - |
| POST | `/auth/logout` | Logout and clear cookie | Yes | USER |

**Login Request Example:**
```json
{
  "email": "trader@example.com",
  "password": "SecurePass123!"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "username": "trader",
      "email": "trader@example.com",
      "authorities": ["ROLE_USER"]
    }
  }
}
```

### Stock Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/stock` | List all stocks (paginated) | Yes | USER |
| GET | `/stock/{id}` | Get stock details | Yes | USER |
| GET | `/stock/stocks/{stockId}/exchanges` | List exchanges for stock | Yes | USER |
| POST | `/stock` | Create new stock | Yes | ADMIN |
| PUT | `/stock/{id}/price` | Update stock price | Yes | ADMIN |
| DELETE | `/stock/{id}` | Delete stock | Yes | ADMIN |

**Query Parameters for `/stock`:**
- `page` (default: 0)
- `size` (default: 10)
- `sort` (default: stockId)
- `direction` (ASC/DESC, default: ASC)

**Create Stock Request:**
```json
{
  "name": "Apple Inc.",
  "description": "Technology company",
  "currentPrice": 175.50
}
```

### Stock Exchange Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/stockExchange` | List all exchanges (paginated) | Yes | USER |
| GET | `/stockExchange/live` | List live exchanges only | Yes | USER |
| GET | `/stockExchange/{id}` | Get exchange details | Yes | USER |
| GET | `/stockExchange/{id}/stocks` | List stocks on exchange | Yes | USER |
| GET | `/stockExchange/{exchangeId}/stocks/not-listed` | List unlisted stocks | Yes | ADMIN |
| POST | `/stockExchange` | Create new exchange | Yes | ADMIN |
| PUT | `/stockExchange/{id}` | Update exchange | Yes | ADMIN |
| DELETE | `/stockExchange/{id}` | Delete exchange | Yes | ADMIN |
| POST | `/stockExchange/{exchangeId}/stocks/{stockId}` | Add stock to exchange | Yes | ADMIN |
| POST | `/stockExchange/{exchangeId}/stocks` | Add multiple stocks | Yes | ADMIN |
| DELETE | `/stockExchange/{exchangeId}/stocks/{stockId}` | Remove stock from exchange | Yes | ADMIN |
| DELETE | `/stockExchange/{exchangeId}/stocks` | Remove multiple stocks | Yes | ADMIN |

**Create Exchange Request:**
```json
{
  "name": "NASDAQ",
  "description": "American stock exchange",
}
```

**Add Multiple Stocks Request:**
```json
{
  "stockIds": [1, 2, 3, 4, 5]
}
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Stock with ID 999 not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Interactive Documentation

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

## 🔒 Security Configuration

### Public Endpoints (No Authentication Required)

- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/actuator/health`
- `/swagger-ui/**`
- `/v3/api-docs/**`
- `/h2-console/**` (dev only)

### Protected Endpoints

All other endpoints require authentication via:

1. **HTTP Header:**
   ```
   Authorization: Bearer <jwt-token>
   ```

2. **HttpOnly Cookie:**
   ```
   Cookie: jwt=<jwt-token>
   ```

### JWT Configuration

- **Algorithm:** HS256
- **Expiration:** 24 hours (configurable)
- **Claims:** userId, username, authorities
- **Secret:** Base64-encoded, minimum 256 bits

### CORS Configuration (Development)

Allowed origins:
- `http://localhost:3000` (Next.js dev server)

For production, update CORS configuration in `SecurityConfig.java`.

### Role Hierarchy

- **ROLE_USER** - Standard operations (view stocks, exchanges, make trades)
- **ROLE_ADMIN** - All USER permissions + management operations (create/update/delete)

First registered user automatically receives `ROLE_ADMIN`.

---

## 🏗 Architecture


### Backend Architecture (Layered)

```
┌─────────────────────────────────────────────┐
│         Controller Layer                    │
│  (REST APIs, @RestController)               │
│  - Request validation                       │
│  - Response formatting                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Service Layer                       │
│  (Business Logic, @Service)                 │
│  - Transaction management                   │
│  - Authorization checks                     │
│  - DTO mapping (MapStruct)                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Repository Layer                    │
│  (Data Access, JpaRepository)               │
│  - Custom queries                           │
│  - Pagination support                       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Database Layer                      │
│  (H2 dev / PostgreSQL prod)                 │
│  - ACID compliance                          │
│  - Optimistic locking                       │
└─────────────────────────────────────────────┘
```

### Security Flow

```
         User Request
              │
              ▼
   ┌──────────────────────┐
   │ JwtAuthentication    │
   │ Filter               │
   │ - Extract token      │
   │ - Validate signature │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐      ┌─────────────────┐
   │ Valid Token?         │─NO──>│ 401 Unauthorized│
   └──────────┬───────────┘      └─────────────────┘
              │ YES
              ▼
   ┌──────────────────────┐
   │ Load User Details    │
   │ Set SecurityContext  │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ @PreAuthorize Check  │
   │ Role verification    │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Controller Method    │
   │ Business Logic       │
   └──────────────────────┘
```

### Containerization Strategy

**Backend: Google Jib**
- Builds OCI images without Docker daemon
- Layer optimization for faster builds
- Reproducible builds
- Direct registry push

**Frontend: Multi-stage Dockerfile**
- Stage 1: Dependencies installation
- Stage 2: Build Next.js app
- Stage 3: Production runtime
- Alpine-based for minimal size

---

## 🐳 Docker & Deployment

### Docker Compose Setup

The project uses Docker Compose to orchestrate multiple services:

**Services:**
- `backend` - Spring Boot API (built with Jib)
- `frontend` - Next.js UI (built with Dockerfile)

### Building with Docker Compose

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend   # Uses Jib via Maven
docker-compose build frontend  # Uses Dockerfile

# Build with no cache
docker-compose build --no-cache

# Start services
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Google Jib Configuration (Backend)

Jib is configured in `pom.xml`:

```xml
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>3.4.0</version>
    <configuration>
        <from>
            <image>eclipse-temurin:17-jre-alpine</image>
        </from>
        <to>
            <image>stock-exchange-backend</image>
            <tags>
                <tag>latest</tag>
                <tag>${project.version}</tag>
            </tags>
        </to>
        <container>
            <ports>
                <port>8080</port>
            </ports>
            <environment>
                <SPRING_PROFILES_ACTIVE>prod</SPRING_PROFILES_ACTIVE>
            </environment>
            <creationTime>USE_CURRENT_TIMESTAMP</creationTime>
            <user>1000:1000</user>
        </container>
    </configuration>
</plugin>
```

### Building Backend with Jib

```bash
cd backend

# Build Docker image locally (requires Docker daemon)
./mvnw clean compile jib:dockerBuild

# Build image and export as tar (no Docker daemon needed)
./mvnw clean compile jib:buildTar

# Push directly to registry (no Docker needed)
./mvnw clean compile jib:build \
  -Djib.to.image=your-registry/stock-exchange-backend:latest \
  -Djib.to.auth.username=YOUR_USERNAME \
  -Djib.to.auth.password=YOUR_PASSWORD

# Build with custom tag
./mvnw clean compile jib:dockerBuild \
  -Djib.to.tags=v1.0.0,latest
```

### Frontend Dockerfile

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose Configuration

**docker-compose.yml** (Development)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      # Jib builds through Maven
    image: stock-exchange-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/data:/app/data
    networks:
      - stock-exchange-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: stock-exchange-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
    depends_on:
      - backend
    networks:
      - stock-exchange-network

networks:
  stock-exchange-network:
    driver: bridge
```



### Why Google Jib?

**Advantages over traditional Docker builds:**

✅ **No Docker Daemon Required** - Build anywhere, even in environments without Docker
✅ **Faster Builds** - Intelligent layer caching and optimization
✅ **Reproducible** - Same input always produces same image
✅ **Better Layering** - Optimized layer structure for dependencies
✅ **Smaller Images** - Efficient base image usage
✅ **CI/CD Friendly** - Easy integration with build pipelines
✅ **Direct Registry Push** - No intermediate Docker daemon needed
✅ **Daemonless** - Works in restricted environments


## 🧪 Testing

### Backend Testing

The project includes comprehensive tests covering:
- Service layer logic
- JWT lifecycle
- Authentication flows
- Repository operations

**Run Tests:**
```bash
cd backend

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=StockServiceTest

# Run with coverage
./mvnw test jacoco:report

# Integration tests
./mvnw verify

# Skip tests during build
./mvnw clean package -DskipTests
```

**Test Categories:**

1. **Service Tests**
    - `StockServiceTest` - Stock CRUD operations
    - `StockExchangeServiceTest` - Exchange management
    - `JwtServiceTest` - Token generation and validation

2. **Controller Tests**
    - `AuthControllerTest` - Login/register flows
    - Integration with Spring Security Test

3. **Repository Tests**
    - Custom query validation
    - Pagination testing

**Test Configuration:**
```yaml
# src/test/resources/application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
  jpa:
    hibernate:
      ddl-auto: create-drop
```

### Frontend Testing

```bash
cd frontend

# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# E2E tests (if configured)
npm run test:e2e
```

### Test Plan Reference

Comprehensive test scenarios covering:
- User registration and authentication
- Stock creation and price updates
- Exchange management
- Stock listing operations
- Pagination and sorting
- Role-based authorization
- JWT token lifecycle
- Error handling and validation

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Backend Configuration
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=your-base64-encoded-secret-key-min-256-bits-change-in-production
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_APP_NAME=Stock Exchange Management System
```

### Spring Profiles

**Development (`application-dev.yml`)**
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/stockexchangedb
    driver-class-name: org.h2.Driver
  h2:
    console:
      enabled: true
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    root: INFO
    com.example.stockexchange: DEBUG
```

# Health check
curl http://localhost:8080/actuator/health

# Application info
curl http://localhost:8080/actuator/info

# Metrics (if enabled)
curl http://localhost:8080/actuator/metrics
```

**Health Check Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

---

## 🎨 Frontend Features

### User Interface

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switcher with persistent preference
- **Real-time Updates** - WebSocket integration for live data
- **Smooth Animations** - Framer Motion for enhanced UX
- **Toast Notifications** - Sonner for user feedback
- **Loading States** - Skeleton screens and spinners

### Key Screens


**Exchange Management **
- Exchange CRUD operations
- Add/remove stocks from exchanges
- Live market status toggle
- Bulk operations

### Authentication Flow

1. User lands on login page
2. Submits credentials
3. Backend validates and returns JWT
4. JWT stored in HttpOnly cookie
5. Frontend redirects to dashboard
6. Subsequent requests include JWT automatically
7. Logout clears cookie and redirects

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   # Click Fork button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Stock-Exchange-Case.git
   cd Stock-Exchange-Case
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
    - Write clean, documented code
    - Follow existing code style
    - Add tests for new features

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
    - Describe your changes
    - Reference any related issues
    - Wait for review

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements
- `ci:` CI/CD changes

**Examples:**
```bash
feat(backend): add stock price history endpoint
fix(frontend): resolve login redirect issue
docs: update API documentation
test(service): add StockService unit tests
```

### Code Standards

**Backend (Java)**
- Follow Google Java Style Guide
- Use meaningful variable names
- Add JavaDoc for public methods
- Keep methods small and focused
- Write unit tests for business logic

**Frontend (TypeScript/React)**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Add PropTypes or TypeScript interfaces

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Abdullah Ebrahim Othman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Author

**Abdullah Ebrahim Othman**
- Email: abdullah.othmansaleh@gmail.com
- GitHub: [@Abdullah-Ebrahim-Othman](https://github.com/Abdullah-Ebrahim-Othman)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/abdullah-othman)

---

## 🙏 Acknowledgments

- **Spring Team** - For the amazing Spring Boot framework
- **Vercel** - For Next.js and excellent documentation
- **Google** - For Jib containerization tool
- **shadcn** - For beautiful UI components
- **Open Source Community** - For countless libraries and tools

---

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core backend API with JWT auth
- [x] Stock and exchange management
- [x] Frontend with basic trading features
- [x] Docker containerization
- [ ] Comprehensive test coverage
---

## 📞 Support

### Getting Help

1. **Check Documentation**
    - README (you're reading it!)
    - API docs at `/swagger-ui.html`
    - Code comments and JavaDocs

2. **Search Issues**
    - [GitHub Issues](https://github.com/Abdullah-Ebrahim-Othman/Stock-Exchange-Case/issues)
    - Someone might have faced the same problem

3. **Create New Issue**
    - Use issue templates
    - Provide detailed information
    - Include error logs and steps to reproduce

4. **Contact**
    - Email: abdullah.othmansaleh@gmail.com
    - Open a GitHub Discussion

### Reporting Bugs

When reporting bugs, please include:
- Operating system and version
- Java version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages and stack traces
- Screenshots (if applicable)

### Feature Requests

We love feature ideas! Please:
- Check if it's already requested
- Describe the feature in detail
- Explain the use case
- Suggest implementation approach (optional)

---

## 💡 Tips & Best Practices

### Development

1. **Use H2 for local development**
    - Fast startup
    - No separate database needed
    - Easy data inspection via console

2. **Enable hot reload**
    - Backend: Spring DevTools
    - Frontend: Next.js dev server

3. **Monitor logs**
    - Use `docker-compose logs -f`
    - Check application logs for errors

### Security

1. **Never commit secrets**
    - Use `.env` files
    - Add `.env` to `.gitignore`
    - Use environment variables

2. **Change default JWT secret**
    - Generate strong, random secret
    - Use base64 encoding
    - Minimum 256 bits

3. **Use HTTPS in production**
    - Enable SSL/TLS
    - Update CORS configuration
    - Secure cookies with `Secure` flag

### Performance

1. **Enable caching**
    - Redis for session storage
    - HTTP caching headers
    - Database query caching

2. **Optimize database queries**
    - Use pagination
    - Add indexes
    - Avoid N+1 queries

3. **Monitor resource usage**
    - Use Actuator metrics
    - Set up alerting
    - Profile application performance

---

## 🔗 Useful Links

### Documentation
- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Jib Guide](https://github.com/GoogleContainerTools/jib)
- [Docker Compose Reference](https://docs.docker.com/compose/)

### Tools
- [Postman API Platform](https://www.postman.com/)
- [DBeaver Database Tool](https://dbeaver.io/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [VS Code](https://code.visualstudio.com/)

### Learning Resources
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT Introduction](https://jwt.io/introduction)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

<div align="center">

### ⭐ Star this repository if you find it helpful! ⭐

**Made with ❤️ by [Abdullah Ebrahim Othman](https://github.com/Abdullah-Ebrahim-Othman)**


