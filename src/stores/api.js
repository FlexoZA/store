import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: 'YOUR_API_BASE_URL',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for handling tokens, etc
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
