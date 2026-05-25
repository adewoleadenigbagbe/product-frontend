import axios, { type AxiosInstance } from 'axios'

const productAPIBaseURL = 'http://localhost:54853'

const http: AxiosInstance = axios.create({
  baseURL: productAPIBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor
// http.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem('authToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// Add response interceptor
// http.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       localStorage.removeItem('authToken')
//     }
//     return Promise.reject(error)
//   }
// )

export default http
