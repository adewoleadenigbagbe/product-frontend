import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/http'
import type { Product, PaginatedResponse, GetProductByIdResponse } from '../types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentPage = ref(1)
  const pageLength = ref(10)
  const totalPage = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all products with pagination
  const fetchProducts = async (page: number = 1, length: number = 10) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<PaginatedResponse<Product>>('/api/product', {
        params: { page, pageLength: length },
      })
      products.value = response.data.items
      currentPage.value = response.data.page
      pageLength.value = response.data.pageLength
      totalPage.value = response.data.totalPage
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  // Get product by ID
  const fetchProductById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<GetProductByIdResponse>(`/api/product/${id}`)
      currentProduct.value = response.data.product
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
      const response = await api.post<Product>('/api/product', product)
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
    pageLength,
    totalPage,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
  }
})
