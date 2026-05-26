import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

const productAPIBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:54853'

const http: AxiosInstance = axios.create({
  baseURL: productAPIBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
http.interceptors.request.use(
  (config) => {
    // Get the auth store and add access token if available
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - token may be expired
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default http
