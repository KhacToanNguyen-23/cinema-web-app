# Cinema Web App

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack web application for online cinema ticket booking, inspired by the CGV Cinema model. The system provides an end-to-end booking experience for customers and a comprehensive management dashboard for administrators.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Business Rules](#business-rules)

---

## Overview

Cinema Web App is designed around two primary concerns: the customer-facing booking portal and the internal administration dashboard. On the customer side, users may browse currently screening and upcoming films, view showtimes by location, select seats through an interactive seat map, add food and beverage combos, and complete payment to receive a QR-coded electronic ticket. On the administration side, operators manage the full catalogue of films, cinemas, screening rooms, and showtimes, and have access to revenue reporting across all locations.

The backend enforces concurrent booking safety through database-level locking, ensuring that two customers cannot reserve the same seat simultaneously. Seats are held for a configurable window during the checkout process and released automatically on payment failure.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend language | Java 17 |
| Backend framework | Spring Boot 3.3.0 |
| Security | Spring Security, JWT (jjwt 0.11.5) |
| Database | PostgreSQL 17 |
| ORM | Spring Data JPA / Hibernate |
| Object mapping | MapStruct 1.5.5 |
| Code generation | Lombok |
| API documentation | SpringDoc OpenAPI (Swagger UI) |
| Frontend framework | React 19 with Vite 8 |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios |
| Client-side routing | React Router DOM v7 |
| Icons | Lucide React |

---

## Architecture

The backend follows a strict layered architecture. Controllers accept HTTP requests and delegate to services; services contain all business logic and communicate with the database exclusively through repository interfaces. All data crossing the API boundary is carried by Data Transfer Objects (DTOs) mapped from and to entities via MapStruct. Entities are never exposed directly in API responses.

Dependency injection throughout the application uses constructor injection via Lombok's `@RequiredArgsConstructor`. All business entities support soft deletion through an `isActive` flag; no physical record deletion occurs.

The frontend is structured by actor and responsibility. API calls are centralised in the `api/` layer. Pages contain no direct HTTP logic. Shared UI primitives live under `components/common/`, while feature-specific components live under `components/feature/`. Route protection and role-based access control are handled in `routes/ProtectedRoute.jsx`.

---

## Project Structure

```
cinema-web-app/
├── backend/
│   └── src/main/java/com/cinema/
│       ├── config/             # Security and application configuration
│       ├── controller/         # REST API endpoints
│       ├── dto/                # Data Transfer Objects
│       ├── entity/             # JPA entities
│       ├── exception/          # Global exception handling
│       ├── mapper/             # MapStruct mapper interfaces
│       ├── repository/         # Spring Data JPA repositories
│       ├── security/           # JWT filter and authentication logic
│       └── service/
│           └── impl/           # Business logic implementations
│
└── frontend/
    └── src/
        ├── api/                # Axios client and per-resource API modules
        ├── components/
        │   ├── common/         # Reusable UI primitives (Button, Modal, etc.)
        │   └── feature/        # Domain-specific components (MovieCard, SeatMap, etc.)
        ├── context/            # Global state via React Context
        ├── layouts/            # Page shell components (AdminLayout, ClientLayout)
        ├── pages/
        │   ├── admin/          # Administration dashboard pages
        │   ├── auth/           # Authentication pages
        │   └── client/         # Customer-facing pages
        └── routes/             # Route definitions and ProtectedRoute
```

---

## Getting Started

### Prerequisites

- Java 17 or later
- Apache Maven 3.8 or later
- Node.js 20 or later
- PostgreSQL 17

### 1. Clone the repository

```bash
git clone https://github.com/KhacToanNguyen-23/cinema-web-app.git
cd cinema-web-app
```

### 2. Configure the backend

Copy the configuration template and supply your own values:

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Edit `application.properties` and set the database credentials and JWT secret as described in the [Configuration](#configuration) section below.

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The REST API will be available at `http://localhost:8080`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Configuration

The file `backend/src/main/resources/application.properties` is excluded from version control. Create it from the provided template (`application.properties.example`) and populate the following values:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5433/cinemadb
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT — generate a secure value with: openssl rand -hex 32
application.security.jwt.secret-key=YOUR_JWT_SECRET
application.security.jwt.expiration=86400000
```

Alternatively, values may be supplied as environment variables and referenced with the `${VAR_NAME}` syntax already present in the template.

---

## API Documentation

Interactive API documentation is generated automatically via SpringDoc OpenAPI. Once the backend is running, navigate to:

```
http://localhost:8080/swagger-ui.html
```

---

## User Roles

| Role | Permissions |
| --- | --- |
| Guest | Browse films and showtimes; login required to book |
| Member | Book tickets, purchase combos, accumulate loyalty points, view booking history |
| Cinema Admin | Manage showtimes and staff; validate tickets by QR scan at the venue |
| Super Admin | Full system access: films, cinemas, nationwide revenue reports |

---

## Business Rules

**Seat reservation hold.** When a customer proceeds to payment, selected seats are locked for a configurable period (default: five to ten minutes). If payment is not completed within that window, the lock is released and the seats become available again.

**Booking deadline.** Tickets may only be purchased or cancelled no later than thirty minutes before the scheduled showtime.

**Age restrictions.** Customers are shown an explicit age warning when booking films classified C13, C16, or C18.

**Concurrent booking safety.** Database-level locking prevents two customers from successfully reserving the same seat when requests arrive simultaneously.

**Soft deletion.** Deletion of any business entity (Region, Cinema, Room, Movie, Showtime, Seat) sets `isActive = false` rather than removing the database record. All default queries filter on `isActive = true`.

**Password storage.** All user passwords are hashed with BCrypt before persistence.

---

## License

This project is licensed under the MIT License.
