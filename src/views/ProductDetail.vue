<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">Loading product...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="productStore.currentProduct" class="detail-container">
      <div class="detail-header">
        <h1>{{ productStore.currentProduct.name }}</h1>
        <RouterLink to="/products" class="btn-back">← Back to Products</RouterLink>
      </div>

      <div class="detail-content">
        <div class="detail-section">
          <h2>Product Information</h2>
          <div class="info-grid">

            <div class="info-item">
              <label>Price</label>
              <p class="price">${{ productStore.currentProduct.price.toFixed(2) }}</p>
            </div>


            <div class="info-item">
              <label>Category</label>
              <p>{{ productStore.currentProduct.category || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Product not found.</p>
      <RouterLink to="/products" class="btn-primary">Back to Products</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '../stores/product'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

const loading = ref(false)
const error = ref<string | null>(null)

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const productId = parseInt(route.params.id as string)
    if (!isNaN(productId)) {
      await productStore.fetchProductById(productId)
    } else {
      error.value = 'Invalid product ID'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.not-found {
  text-align: center;
  padding: 60px 20px;
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

.detail-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
  background: #fafafa;
}

.detail-header h1 {
  margin: 0;
  color: #333;
}

.btn-back {
  background: #f0f0f0;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn-back:hover {
  background: #e0e0e0;
}

.detail-content {
  padding: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h2 {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item label {
  display: block;
  color: #666;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.info-item p {
  color: #333;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

.price {
  color: #4CAF50;
  font-size: 24px !important;
  font-weight: 600 !important;
}

.description {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.btn-edit,
.btn-delete,
.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-edit {
  background: #2196F3;
  color: white;
}

.btn-edit:hover {
  background: #0b7dda;
}

.btn-delete {
  background: #d32f2f;
  color: white;
}

.btn-delete:hover {
  background: #c62828;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary:hover {
  background: #45a049;
}

.not-found {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.not-found p {
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>
