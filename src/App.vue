<template>
  <header>
    <nav>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/products">Products</router-link>
      </div>
      <UserProfile />
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  console.log('App mounted')
  // Initialize authentication
  await authStore.initializeAuth()
})
</script>

<style scoped>
header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

a {
  text-decoration: none;
  color: #0066cc;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
