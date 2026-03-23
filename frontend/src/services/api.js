import axios from 'axios';

// Base URL for all API calls
const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ────────────────────────────────────────
// 🔐 AUTH APIs
// ────────────────────────────────────────
export const loginAPI = (data) => api.post('/auth/login', data);
export const forgotPasswordAPI = (data) => api.post('/auth/forgot-password', data);
export const resetPasswordAPI = (data) => api.post('/auth/reset-password', data);

// ────────────────────────────────────────
// 👨‍💼 EMPLOYEE APIs
// ────────────────────────────────────────
export const getAllEmployeesAPI = () => api.get('/employees');
export const getEmployeeByIdAPI = (id) => api.get(`/employees/${id}`);
export const addEmployeeAPI = (data) => api.post('/employees', data);
export const updateEmployeeAPI = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployeeAPI = (id) => api.delete(`/employees/${id}`);
export const searchEmployeesAPI = (name) => api.get(`/employees/search?name=${name}`);
export const filterByDeptAPI = (deptId) => api.get(`/employees/filter?departmentId=${deptId}`);
export const sortEmployeesAPI = (sortBy) => api.get(`/employees/sort?sortBy=${sortBy}`);

// ────────────────────────────────────────
// 🏢 DEPARTMENT APIs
// ────────────────────────────────────────
export const getAllDepartmentsAPI = () => api.get('/departments');
export const createDepartmentAPI = (data) => api.post('/departments', data);
export const updateDepartmentAPI = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartmentAPI = (id) => api.delete(`/departments/${id}`);

// ────────────────────────────────────────
// 📊 DASHBOARD API
// ────────────────────────────────────────
export const getDashboardAPI = () => api.get('/dashboard');
