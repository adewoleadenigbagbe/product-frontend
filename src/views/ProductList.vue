<template>
  <div class="product-list">
    <div class="header">
      <h1>Products</h1>
      <RouterLink to="/products/add" class="btn-add">+ Add Product</RouterLink>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="productStore.products.length === 0" class="empty-state">
      <p>No products found.</p>
      <RouterLink to="/products/add" class="btn-primary">Add First Product</RouterLink>
    </div>

    <div v-else>
      <table class="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.category || '-' }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td class="actions">
              <RouterLink :to="`/products/${product.id}`" class="link-view">View</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="productStore.totalPages > 1" class="pagination">
        <button
          :disabled="productStore.currentPage === 1"
          @click="goToPage(productStore.currentPage - 1)"
          class="page-btn"
        >
          ← Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="{ active: page === productStore.currentPage }"
            @click="goToPage(page)"
            class="page-btn"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="productStore.currentPage === productStore.totalPages"
          @click="goToPage(productStore.currentPage + 1)"
          class="page-btn"
        >
          Next →
        </button>
      </div>

      <div class="pagination-info">
        Page {{ productStore.currentPage }} of {{ productStore.totalPages }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '../stores/product'

const productStore = useProductStore()
const loading = ref(false)
const error = ref<string | null>(null)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, productStore.currentPage - 2)
  const end = Math.min(productStore.totalPages, productStore.currentPage + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = async (page: number) => {
  await productStore.fetchProducts(page, productStore.pageSize)
}



onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await productStore.fetchProducts()
  } catch (err: any) {
    error.value = err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #333;
  margin: 0;
}

.btn-add {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s ease;
}

.btn-add:hover {
  background: #45a049;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 16px;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #45a049;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.products-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.products-table th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.products-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  color: #555;
}

.products-table tbody tr:hover {
  background: #fafafa;
}

.actions {
  display: flex;
  gap: 10px;
}

.link-view,
.link-delete {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
}

.link-view {
  background: #e3f2fd;
  color: #1976d2;
}

.link-view:hover {
  background: #bbdefb;
}

.link-delete {
  background: #ffebee;
  color: #d32f2f;
}

.link-delete:hover {
  background: #ffcdd2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 30px 0 20px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #999;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.pagination-info {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .products-table th,
  .products-table td {
    padding: 8px 10px;
    font-size: 13px;
  }

  .link-view,
  .link-delete {
    padding: 2px 6px;
    font-size: 11px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }

  .page-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
  }
}
</style>
