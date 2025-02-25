import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Referrer-Policy' : 'no-referrer-when-downgrade',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
  }
});

const api = {
  // Customer endpoints
  getCustomers: () => axiosInstance.get('/customers'),
  getCustomer: (id) => axiosInstance.get(`/customers/${id}`),
  createCustomer: (data) => axiosInstance.post('/customers', data),
  updateCustomer: (id, data) => axiosInstance.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosInstance.delete(`/customers/${id}`),

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
