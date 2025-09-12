import axios from 'axios';

const API_BASE_URL = 'https://sona-sarees-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// const instance = axios.create({
//   baseURL: "http://localhost:5000/api", // or your deployed backend URL
// });

// Customer API calls
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getByReferId: (referId) => api.get(`/customers/refer/${referId}`),
  create: (customerData) => api.post('/customers', customerData),
  updateWallet: (id, amount) => api.patch(`/customers/${id}/wallet`, { amount }),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Purchase API calls
export const purchaseAPI = {
  getAll: () => api.get('/purchases'),
  create: (purchaseData) => api.post('/purchases', purchaseData),
  getByCustomer: (referId) => api.get(`/purchases/customer/${referId}`),
  clearAll: () => api.delete('/purchases/clear/all'),
};

export default api;
