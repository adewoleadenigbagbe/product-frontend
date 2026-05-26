/**
 * useAuth composable
 * Provides easy access to auth functionality in components
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    error: computed(() => authStore.error),
    userName: computed(() => authStore.userName),
    userEmail: computed(() => authStore.userEmail),
    accessToken: computed(() => authStore.accessToken),

    // Methods
    login: () => authStore.login(),
    logout: () => authStore.logout(),
    refreshToken: () => authStore.refreshToken(),
    clearError: () => authStore.clearError(),
    getAccessToken: () => authService.getAccessToken(),
  }
}
