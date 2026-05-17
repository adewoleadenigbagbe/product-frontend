<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted')
})
</script>

<style scoped>
header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

nav {
  display: flex;
  gap: 1rem;
}

a {
  text-decoration: none;
  color: #0066cc;
}

a:hover {
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
