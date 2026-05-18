<template>
  <div class="add-product">
    <h1>Add New Product</h1>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Product Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter product name"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="price">Price *</label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="price">Vat *</label>
          <input
            id="vat"
            v-model.number="form.vat"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <input
          id="category"
          v-model="form.category"
          type="number"
          placeholder="Enter product category"
        />
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Adding...' : 'Add Product' }}
        </button>
        <RouterLink to="/products" class="btn-secondary">Cancel</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { RouterLink } from 'vue-router'

const router = useRouter()
const productStore = useProductStore()

const form = ref({
  name: '',
  price: 0,
  vat: 0,
  category: 0,
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    await productStore.addProduct(form.value)
    router.push('/products')
  } catch (err: any) {
    error.value = err.message || 'Failed to add product'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-product {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

textarea {
  resize: vertical;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #d32f2f;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: background 0.3s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
