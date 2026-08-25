# Cinema Web App

A personal learning project. A cinema ticket booking web application built with **Java** and **Spring Boot**, inspired by the CGV Cinema model. This project was built to practise building a **RESTful API** backend with **Spring Security**, **JWT** authentication, and **Spring Data JPA**, integrated with a **React** frontend.

---

## Requirements

- Java 17
- Apache Maven 3.8
- Node.js 20
- PostgreSQL 17

---

## Installation

**Backend**

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Edit `application.properties` with your database credentials and JWT secret, then:

```bash
cd backend && mvn spring-boot:run
```

API runs on `http://localhost:8080`.

**Frontend**

```bash
cd frontend && npm install && npm run dev
```

Client runs on `http://localhost:5173`.

---

## Configuration

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/cinemadb
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# Generate with: openssl rand -hex 32
application.security.jwt.secret-key=YOUR_JWT_SECRET
application.security.jwt.expiration=86400000
```

---

## Tech Stack

**Backend**

- **Java 17** + **Spring Boot 3.3.0**
- **Spring Security** + **JWT** (`jjwt 0.11.5`) for authentication and route protection
- **Spring Data JPA** + **Hibernate** for ORM
- **PostgreSQL 17** as the primary database
- **MapStruct** for DTO mapping, **Lombok** to reduce boilerplate
- **SpringDoc OpenAPI** for auto-generated API docs (`/swagger-ui.html`)

**Frontend**

- **React 19** + **Vite 8**
- **Tailwind CSS v4** for styling
- **React Router DOM v7** for client-side routing
- **Axios** for HTTP requests

---

## Project Structure

```
cinema-web-app/
├── backend/src/main/java/com/cinema/
│   ├── config/          # Spring Security and app config
│   ├── controller/      # REST API endpoints
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── mapper/          # MapStruct interfaces
│   ├── repository/      # JPA repositories
│   ├── security/        # JWT filter and auth logic
│   └── service/impl/    # Business logic
│
└── frontend/src/
    ├── api/             # Axios client and API calls
    ├── components/
    ├── context/         # Auth context
    ├── layouts/
    ├── pages/
    │   ├── admin/
    │   ├── auth/
    │   └── client/
    └── routes/          # Protected routes
```

---

## Features

**Customer**

- Browse now-showing and upcoming films
- Select seats through an interactive seat map
- Multi-step booking flow: film → showtime → seats → payment
- QR-coded e-ticket after booking

**Admin**

- Manage films, cinemas, rooms, and showtimes
- View bookings and validate tickets by QR scan

---

## What I Practised

- Designing a layered **Spring Boot** application (`controller → service → repository`)
- Implementing **JWT**-based authentication with **Spring Security**
- Using **Spring Data JPA** with entity relationships and soft delete
- Applying **MapStruct** to map between `Entity` and `DTO`
- Building a protected **React** frontend that consumes a **REST API**

---

## License

MIT
