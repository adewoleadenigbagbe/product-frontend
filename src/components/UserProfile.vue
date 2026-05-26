<template>
  <div class="user-profile">
    <div v-if="authStore.isAuthenticated" class="authenticated">
      <div class="user-info">
        <span class="user-name">{{ authStore.userName }}</span>
        <span v-if="authStore.userEmail" class="user-email">{{ authStore.userEmail }}</span>
      </div>
      <button @click="handleLogout" :disabled="authStore.isLoading" class="logout-btn">
        {{ authStore.isLoading ? 'Logging out...' : 'Logout' }}
      </button>
    </div>
    <div v-else class="not-authenticated">
      <button @click="handleLogin" :disabled="authStore.isLoading" class="login-btn">
        {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </div>
    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
      <button @click="authStore.clearError" class="close-btn">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogin = async () => {
  await authStore.login()
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.authenticated {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.user-email {
  color: #666;
  font-size: 0.85rem;
}

.login-btn,
.logout-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.login-btn {
  background: #0066cc;
  color: white;
}

.login-btn:hover:not(:disabled) {
  background: #0052a3;
}

.logout-btn {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.logout-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.login-btn:disabled,
.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.close-btn {
  background: none;
  border: none;
  color: #c33;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.close-btn:hover {
  color: #a22;
}
</style>
