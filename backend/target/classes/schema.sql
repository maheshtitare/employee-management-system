-- ============================================
-- Employee Management System - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS ems_db;
USE ems_db;

-- ✅ Department Table
CREATE TABLE IF NOT EXISTS departments (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Users Table (for login / auth)
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE,
    mobile     VARCHAR(15) UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('ADMIN','USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Employee Table
CREATE TABLE IF NOT EXISTS employees (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    mobile        VARCHAR(15)  NOT NULL UNIQUE,
    department_id BIGINT,
    salary        DECIMAL(12, 2),
    joining_date  DATE,
    status        ENUM('Active','Inactive') DEFAULT 'Active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- ============================================
-- Sample Data
-- ============================================

-- Departments
INSERT INTO departments (name) VALUES
('HR'),
('IT'),
('Sales'),
('Finance'),
('Marketing')
ON DUPLICATE KEY UPDATE name = name;

-- Admin user  (password = Admin@123 — stored as plain text for simplicity)
INSERT INTO users (name, email, mobile, password, role) VALUES
('Mahesh Admin', 'admin@ems.com', '9999999999', 'Admin@123', 'ADMIN')
ON DUPLICATE KEY UPDATE email = email;

-- Regular user
INSERT INTO users (name, email, mobile, password, role) VALUES
('Rahul User', 'user@ems.com', '8888888888', 'User@1234', 'USER')
ON DUPLICATE KEY UPDATE email = email;

-- Sample Employees
INSERT INTO employees (name, email, mobile, department_id, salary, joining_date, status) VALUES
('Aarav Sharma',   'aarav@ems.com',   '9111111111', 2, 75000.00, '2023-01-15', 'Active'),
('Sneha Patel',    'sneha@ems.com',   '9222222222', 1, 55000.00, '2022-06-01', 'Active'),
('Rohit Verma',    'rohit@ems.com',   '9333333333', 3, 60000.00, '2023-03-20', 'Active'),
('Priya Mehta',    'priya@ems.com',   '9444444444', 4, 80000.00, '2021-11-10', 'Active'),
('Karan Singh',    'karan@ems.com',   '9555555555', 2, 90000.00, '2022-08-05', 'Active'),
('Ananya Joshi',   'ananya@ems.com',  '9666666666', 5, 50000.00, '2024-01-01', 'Active'),
('Vikram Gupta',   'vikram@ems.com',  '9777777777', 1, 52000.00, '2023-07-15', 'Inactive')
ON DUPLICATE KEY UPDATE email = email;
