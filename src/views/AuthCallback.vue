<template>
  <div class="auth-callback">
    <div v-if="isProcessing" class="loading">
      <p>Processing login...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>Authentication failed: {{ error }}</p>
      <router-link to="/">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isProcessing = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const success = await authStore.handleCallback()
    if (success) {
      // Redirect to originally requested page or home
      const redirectUrl = sessionStorage.getItem('auth_redirect') || '/'
      sessionStorage.removeItem('auth_redirect')
      router.replace(redirectUrl)
    } else {
      error.value = authStore.error || 'Failed to process login'
      isProcessing.value = false
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Authentication error'
    isProcessing.value = false
  }
})
</script>

<style scoped>
.auth-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.loading p {
  font-size: 1.2rem;
  color: #666;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

.error p {
  margin: 0 0 1rem 0;
}

.error a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #c33;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.error a:hover {
  background: #a22;
}
</style>
