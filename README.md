# ⚡ EMS Pro — Employee Management System
### Full Stack: Spring Boot + React + MySQL

---

## 📁 Project Structure

```
ems-project/
├── ems-backend/                    ← Spring Boot (Java)
│   ├── pom.xml
│   └── src/main/java/com/ems/
│       ├── controller/             ← REST API endpoints
│       ├── service/                ← Service interfaces
│       ├── serviceImpl/            ← Business logic
│       ├── repository/             ← DB queries (JPA)
│       ├── entity/                 ← DB table classes
│       ├── dto/                    ← Data Transfer Objects
│       ├── exception/              ← Error handling
│       └── config/                 ← CORS config
│
└── ems-frontend/                   ← React (JavaScript)
    ├── package.json
    └── src/
        ├── context/                ← Global auth state
        ├── services/               ← Axios API calls
        ├── pages/                  ← Login, Dashboard, Employees, Departments
        ├── components/             ← Sidebar, Forms, Modals
        └── styles/                 ← Global CSS
```

---

## 🛠️ STEP-BY-STEP SETUP

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

---

### ✅ STEP 1: Setup MySQL Database

1. Open MySQL Workbench or terminal
2. Run the schema file:

```sql
-- Run this file:
ems-backend/src/main/resources/schema.sql
```

This creates:
- `ems_db` database
- `departments`, `users`, `employees` tables
- Sample data (departments + 2 users + 7 employees)

---

### ✅ STEP 2: Configure Backend (application.properties)

Open: `ems-backend/src/main/resources/application.properties`

Change MySQL credentials if needed:
```properties
spring.datasource.username=root
spring.datasource.password=root     ← change to your MySQL password
```

---

### ✅ STEP 3: Run Spring Boot Backend

```bash
# Navigate to backend folder
cd ems-backend

# Run using Maven
mvn spring-boot:run

# OR build and run JAR
mvn clean package
java -jar target/employee-management-system-1.0.0.jar
```

✅ Backend running at: **http://localhost:8080**

---

### ✅ STEP 4: Run React Frontend

```bash
# Navigate to frontend folder
cd ems-frontend

# Install dependencies (first time only)
npm install

# Start React app
npm start
```

✅ Frontend running at: **http://localhost:3000**

---

### ✅ STEP 5: Login

Open browser: **http://localhost:3000**

| Role  | Email           | Password   |
|-------|-----------------|------------|
| Admin | admin@ems.com   | Admin@123  |
| User  | user@ems.com    | User@1234  |

---

## 🌐 API Reference (Postman Testing)

### Auth APIs
```
POST   http://localhost:8080/api/auth/login
POST   http://localhost:8080/api/auth/forgot-password
POST   http://localhost:8080/api/auth/reset-password
```

**Login Body (Email):**
```json
{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

**Login Body (Mobile):**
```json
{
  "mobile": "9999999999",
  "password": "Admin@123"
}
```

---

### Employee APIs
```
GET    http://localhost:8080/api/employees              → Get all
GET    http://localhost:8080/api/employees/{id}         → Get by ID
POST   http://localhost:8080/api/employees              → Add
PUT    http://localhost:8080/api/employees/{id}         → Update
DELETE http://localhost:8080/api/employees/{id}         → Soft Delete
GET    http://localhost:8080/api/employees/search?name=Aarav
GET    http://localhost:8080/api/employees/filter?departmentId=2
GET    http://localhost:8080/api/employees/sort?sortBy=salary
```

**Add Employee Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@ems.com",
  "mobile": "9012345678",
  "departmentId": 2,
  "salary": 65000,
  "joiningDate": "2024-01-15",
  "status": "Active"
}
```

---

### Department APIs
```
GET    http://localhost:8080/api/departments
POST   http://localhost:8080/api/departments
PUT    http://localhost:8080/api/departments/{id}
DELETE http://localhost:8080/api/departments/{id}
```

### Dashboard API
```
GET    http://localhost:8080/api/dashboard
```

---

## 🎯 Interview Explanation Points

### Q: What is the architecture of this project?
**A:** Layered architecture — Controller handles HTTP request, calls Service (business logic), which calls Repository (DB operations). Entity maps to DB table, DTO carries data between layers.

### Q: What is Soft Delete?
**A:** Instead of removing the record from DB, we just change `status = "Inactive"`. Data is preserved and can be restored.

### Q: What is DTO pattern?
**A:** DTO (Data Transfer Object) separates the API input/output from the DB entity. Example: EmployeeRequestDTO is what frontend sends, EmployeeResponseDTO is what backend returns — cleaner and secure.

### Q: How does authentication work?
**A:** User sends email/mobile + password. Backend queries DB, compares passwords, returns user info. Session stored in React's sessionStorage. No JWT (kept simple for fresher level).

### Q: What are @PrePersist and @PreUpdate?
**A:** JPA lifecycle callbacks. @PrePersist runs before saving new record (sets createdAt). @PreUpdate runs before every update (sets updatedAt).

### Q: How does CORS work?
**A:** React runs on port 3000, Spring Boot on 8080. Browser blocks cross-origin requests by default. CorsConfig.java tells Spring Boot to allow requests from port 3000.

### Q: What validations are used?
**A:** Frontend: manual JS validation before form submit. Backend: Bean Validation annotations like @NotBlank, @Email, @Pattern on DTOs. Global exception handler returns clean error JSON.

---

## 🔐 Password Policy
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@#$%^&+=!)

---

## 🚀 Features Summary

| Feature              | Status |
|----------------------|--------|
| Email + Mobile Login | ✅     |
| Forgot/Reset Password| ✅     |
| Add/Edit Employee    | ✅     |
| Soft Delete          | ✅     |
| Search (Real-time)   | ✅     |
| Filter by Department | ✅     |
| Sort by Name/Salary  | ✅     |
| Pagination           | ✅     |
| Employee Profile View| ✅     |
| Department CRUD      | ✅     |
| Dashboard Stats      | ✅     |
| Role-based Access    | ✅     |
| Toast Notifications  | ✅     |
| Confirm Delete Popup | ✅     |
| Loading Spinners     | ✅     |
| Responsive Design    | ✅     |
