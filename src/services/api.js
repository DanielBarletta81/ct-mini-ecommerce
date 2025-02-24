import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // backend URL

const api = {
  // Customer endpoints
  getCustomers: () => axios.get(`${API_BASE_URL}/customers`),
  getCustomer: (id) => axios.get(`${API_BASE_URL}/customers/${id}`),
  createCustomer: (data) => axios.post(`${API_BASE_URL}/customers`, data),
  updateCustomer: (id, data) => axios.put(`${API_BASE_URL}/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${API_BASE_URL}/customers/${id}`),

  // Product endpoints
  getProducts: () => axios.get(`${API_BASE_URL}/products`),
  getProduct: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
  createProduct: (data) => axios.post(`${API_BASE_URL}/products`, data),
  updateProduct: (id, data) => axios.put(`${API_BASE_URL}/products/${id}`, data),
  deleteProduct: (id) => axios.delete(`${API_BASE_URL}/products/${id}`),

  // Order endpoints
  getOrders: () => axios.get(`${API_BASE_URL}/orders`),
  createOrder: (data) => axios.post(`${API_BASE_URL}/orders`, data),
};

export default api;
