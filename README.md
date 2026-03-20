# Employee Management System
Full Stack Project | Spring Boot + React.js + MySQL

## 🗂 Folder Structure

```
employee-management/
│
├── backend/                         ← Spring Boot Project
│   ├── pom.xml                      ← Maven dependencies
│   └── src/main/java/com/emp/management/
│       ├── EmployeeManagementApplication.java  ← Main class
│       ├── DataInitializer.java     ← Seeds default users + employees
│       │
│       ├── entity/
│       │   ├── User.java            ← Login credentials table
│       │   └── Employee.java        ← Employee data table
│       │
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── EmployeeRepository.java
│       │
│       ├── security/
│       │   ├── JwtUtil.java         ← Generate & validate JWT tokens
│       │   └── JwtAuthFilter.java   ← Intercept requests, validate token
│       │
│       ├── config/
│       │   └── SecurityConfig.java  ← Spring Security + CORS setup
│       │
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── LoginResponse.java
│       │   ├── EmployeeDTO.java
│       │   ├── PageResponse.java
│       │   └── DashboardDTO.java
│       │
│       ├── exception/
│       │   ├── EmployeeNotFoundException.java
│       │   └── GlobalExceptionHandler.java  ← @ControllerAdvice
│       │
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── EmployeeService.java
│       │   └── DashboardService.java
│       │
│       └── controller/
│           ├── AuthController.java
│           ├── EmployeeController.java
│           └── DashboardController.java
│
└── frontend/                        ← React Project
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js                 ← Entry point
        ├── App.js                   ← Routes setup
        │
        ├── api/
        │   ├── axios.js             ← Axios instance with JWT interceptor
        │   ├── authAPI.js
        │   └── employeeAPI.js
        │
        ├── components/
        │   └── Navbar.jsx
        │
        └── pages/
            ├── LoginPage.jsx
            ├── Dashboard.jsx
            ├── EmployeeList.jsx
            └── EmployeeForm.jsx
```

---

## ⚙️ Backend Setup

### Prerequisites
- Java 17
- Maven
- MySQL running on port 3306

### Steps
```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE employee_db;
exit;

# 2. Update credentials in application.properties if needed
# File: backend/src/main/resources/application.properties

# 3. Run the backend
cd backend
mvn spring-boot:run
```

Backend runs on: **http://localhost:8080**

**Default Credentials (auto-created on startup):**
| Role     | Email                    | Password  |
|----------|--------------------------|-----------|
| Admin    | admin@company.com        | admin123  |
| Employee | employee@company.com     | emp123    |

---

## ⚛️ Frontend Setup

### Prerequisites
- Node.js 18+

### Steps
```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint                          | Auth  | Description             |
|--------|-----------------------------------|-------|-------------------------|
| POST   | /api/auth/login                   | No    | Login                   |
| GET    | /api/employees                    | Yes   | Get all (+ search/page) |
| GET    | /api/employees/{id}               | Yes   | Get one employee        |
| POST   | /api/employees                    | Yes   | Add employee            |
| PUT    | /api/employees/{id}               | Yes   | Update employee         |
| DELETE | /api/employees/{id}               | Yes   | Delete employee         |
| GET    | /api/dashboard                    | Yes   | Dashboard stats         |

---

## 📝 Interview Talking Points

1. **Layered Architecture**: Entity → Repository → Service → Controller
2. **JWT Flow**: Login → Get token → Send in Authorization header → JwtAuthFilter validates
3. **@ControllerAdvice**: Single place to handle all exceptions globally
4. **Spring Data JPA**: No SQL needed, just method names or @Query
5. **Pagination**: Pageable object handles page number, size, and sorting
6. **CORS**: Configured to allow React (port 3000) to call Spring (port 8080)
7. **BCrypt**: Passwords never stored as plain text
8. **DTO Pattern**: Separates API request/response data from database entities
