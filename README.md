# 🎬 Cinema Web App

A full-stack web application for online movie ticket booking, inspired by CGV Cinema. Built with **Spring Boot** (backend) and **React + Vite** (frontend).

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Business Rules](#-business-rules)

---

## ✨ Features

### 🎟️ Customer Site
- Browse **Now Showing** and **Coming Soon** movies
- View movie details: poster, trailer (YouTube embed), synopsis, cast & director
- **Multi-step booking flow:**
  1. Select Movie → Cinema → Showtime
  2. Choose seats (Regular / VIP / Sweetbox) via interactive seat map
  3. Add Combos (popcorn & drinks)
  4. Pay online (Credit Card / MoMo / ZaloPay / Pay at Cinema)
  5. Receive e-ticket with QR Code via email
- Member account: booking history, loyalty points, membership card
- Age restriction warnings for rated films (C13, C16, C18)

### 🛡️ Admin Dashboard
- Manage Movies, Cinemas, Rooms & Showtimes
- Design seat maps per screening room
- Schedule showtimes with conflict detection
- Manage bookings & tickets (search, cancel, exchange)
- Revenue reports: charts by movie, cinema, and time period
- QR code scanner for ticket validation at the venue

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17, Spring Boot 3.3.0 |
| **Security** | Spring Security, JWT (jjwt 0.11.5) |
| **Database** | PostgreSQL 17 |
| **ORM** | Spring Data JPA (Hibernate) |
| **Mapping** | MapStruct 1.5.5 |
| **Utilities** | Lombok |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Frontend** | React 19, Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
cinema-web-app/
├── backend/                    # Spring Boot application
│   └── src/main/java/com/cinema/
│       ├── config/             # Security & app configuration
│       ├── controller/         # REST API endpoints
│       ├── dto/                # Data Transfer Objects
│       ├── entity/             # JPA entities
│       ├── exception/          # Global exception handling
│       ├── mapper/             # MapStruct mappers
│       ├── repository/         # Spring Data JPA repositories
│       ├── security/           # JWT filter & auth logic
│       └── service/            # Business logic layer
│           └── impl/
│
└── frontend/                   # React + Vite application
    └── src/
        ├── api/                # Axios client & API service files
        ├── components/
        │   ├── common/         # Reusable UI (Button, Input, Modal…)
        │   └── feature/        # Feature-specific (MovieCard, SeatMap…)
        ├── context/            # Global state management
        ├── layouts/            # AdminLayout, ClientLayout
        ├── pages/
        │   ├── admin/          # Admin dashboard pages
        │   ├── auth/           # Login, Register pages
        │   └── client/         # Customer-facing pages
        └── routes/             # ProtectedRoute & routing config
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 20+
- PostgreSQL 17

### 1. Clone the repository

```bash
git clone https://github.com/KhacToanNguyen-23/cinema-web-app.git
cd cinema-web-app
```

### 2. Backend Setup

**Configure the database** — create a PostgreSQL database and update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/cinemadb
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# JWT Secret (change this in production!)
app.jwt.secret=YOUR_SECRET_KEY
app.jwt.expiration=86400000
```

**Run the backend:**

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📖 API Documentation

Once the backend is running, visit the interactive Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Guest** | Browse movies and showtimes; must log in to book |
| **Member** | Book tickets, buy combos, earn loyalty points, view booking history |
| **Cinema Admin** | Manage showtimes, staff, and scan QR codes at the venue |
| **Super Admin** | Full system access: movies, cinemas, national revenue reports |

---

## 📐 Business Rules

- **Seat Hold:** Seats are temporarily locked for **5–10 minutes** during checkout. Released automatically if payment fails.
- **Booking Deadline:** Tickets can only be booked or cancelled at least **30 minutes** before the showtime.
- **Age Restrictions:** Age warnings are shown for films rated C13, C16, and C18.
- **Concurrent Booking:** Database-level locking prevents double-booking when two users select the same seat simultaneously.
- **Soft Delete:** All business entities use `isActive` flag instead of hard deletion.
- **Password Security:** All passwords are hashed with BCrypt.

---

## 🎨 Design System

- **Theme:** Dark Mode — cinematic feel inspired by CGV
- **Primary Color:** Cinema Red `#E50914`
- **Background:** Pure Black `#000000` / Dark Gray `#141414`
- **Font:** Montserrat / Inter
- **Responsive:** Desktop & Mobile compatible

---

## 📄 License

This project is licensed under the MIT License.
