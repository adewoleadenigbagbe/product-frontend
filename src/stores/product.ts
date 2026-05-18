import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/http'
import type { Product, PaginatedResponse } from '../types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all products with pagination
  const fetchProducts = async (page: number = 1, size: number = 10) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<PaginatedResponse<Product>>('/products', {
        params: { page, pageSize: size },
      })
      products.value = response.data.data
      currentPage.value = response.data.page
      pageSize.value = response.data.pageSize
      totalPages.value = response.data.totalPages
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  // Get product by ID
  const fetchProductById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Product>(`/products/${id}`)
      currentProduct.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
    } finally {
      loading.value = false
    }
  }

  // Add new product
  const addProduct = async (product: Omit<Product, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<Product>('/products', product)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to add product'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    currentPage,
    pageSize,
    totalPages,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
  }
})
