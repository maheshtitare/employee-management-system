import API from "./axios";

/**
 * employeeAPI.js - All API calls for employee operations.
 * Each function matches a backend controller endpoint.
 */

// GET /api/employees?name=&department=&page=0&size=5
export const getEmployeesAPI = (name = "", department = "", page = 0, size = 5) => {
  return API.get("/employees", { params: { name, department, page, size } });
};

// GET /api/employees/:id
export const getEmployeeByIdAPI = (id) => API.get(`/employees/${id}`);

// POST /api/employees
export const addEmployeeAPI = (data) => API.post("/employees", data);

// PUT /api/employees/:id
export const updateEmployeeAPI = (id, data) => API.put(`/employees/${id}`, data);

// DELETE /api/employees/:id
export const deleteEmployeeAPI = (id) => API.delete(`/employees/${id}`);

// GET /api/dashboard
export const getDashboardAPI = () => API.get("/dashboard");
