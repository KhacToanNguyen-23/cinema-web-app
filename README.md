# Cinema Web App

A full-stack cinema ticket booking platform built with Spring Boot and React. The system covers the complete booking lifecycle — from film discovery and seat selection through to payment and e-ticket delivery — alongside an administrative suite for cinema operations and revenue reporting.

---

## Requirements

- Java 17
- Apache Maven 3.8
- Node.js 20
- PostgreSQL 17

---

## Installation

**Backend**

Copy the configuration template, populate the required values (see [Configuration](#configuration)), then start the server:

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties

cd backend && mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

**Frontend**

```bash
cd frontend && npm install && npm run dev
```

The client starts on `http://localhost:5173`.

---

## Configuration

`application.properties` is excluded from version control. The required keys are:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/cinemadb
spring.datasource.username=
spring.datasource.password=

# Generate with: openssl rand -hex 32
application.security.jwt.secret-key=
application.security.jwt.expiration=86400000
```

Values may alternatively be supplied as environment variables.

---

## Architecture

The backend follows a strict layered model: `controller → service → repository`. Business entities are never serialised directly into API responses; all cross-boundary data travels via DTOs mapped through MapStruct interfaces. Dependency injection uses constructor injection throughout, enforced by Lombok's `@RequiredArgsConstructor`. Deletion of any business record sets `isActive = false` rather than removing the row; all read queries filter on this flag.

The frontend separates concerns by actor and responsibility. HTTP calls are centralised in the `api/` layer and are never made directly from page components. Route-level access control is enforced in `ProtectedRoute.jsx`.

```
cinema-web-app/
├── backend/src/main/java/com/cinema/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── mapper/
│   ├── repository/
│   ├── security/
│   └── service/impl/
│
└── frontend/src/
    ├── api/
    ├── components/
    │   ├── common/
    │   └── feature/
    ├── context/
    ├── layouts/
    ├── pages/
    │   ├── admin/
    │   ├── auth/
    │   └── client/
    └── routes/
```

---

## Stack

| | |
| --- | --- |
| Backend | Java 17, Spring Boot 3.3.0 |
| Security | Spring Security, JWT via jjwt 0.11.5 |
| Persistence | PostgreSQL 17, Spring Data JPA, Hibernate |
| Mapping | MapStruct 1.5.5, Lombok |
| API docs | SpringDoc OpenAPI — `http://localhost:8080/swagger-ui.html` |
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| HTTP | Axios |

---

## Access Control

| Role | Scope |
| --- | --- |
| Guest | Browse films and showtimes; authentication required to book |
| Member | Book tickets, purchase concessions, view history, accumulate loyalty points |
| Cinema Admin | Manage showtimes; validate tickets by QR scan at the venue |
| Super Admin | Full system access including cross-location revenue reporting |

---

## Business Constraints

**Seat hold.** On entering the payment step, selected seats are locked for up to ten minutes. The lock releases automatically on timeout or payment failure.

**Booking window.** Purchase and cancellation are permitted only up to thirty minutes before the scheduled showtime.

**Age classification.** An explicit warning is presented to the customer when booking any film classified C13, C16, or C18.

**Concurrent reservation.** Database-level locking prevents two concurrent requests from successfully reserving the same seat.

**Password storage.** Passwords are hashed with BCrypt prior to persistence.

---

## License

MIT
