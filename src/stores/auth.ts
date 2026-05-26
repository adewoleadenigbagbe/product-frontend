/**
 * Auth Store (Pinia)
 * Manages authentication state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User } from 'oidc-client-ts'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !user.value.expired)
  const userName = computed(() => user.value?.profile.name || user.value?.profile.preferred_username || 'User')
  const userEmail = computed(() => user.value?.profile.email || '')
  const accessToken = computed(() => user.value?.access_token || null)

  // Initialize auth on store creation
  const initializeAuth = async () => {
    try {
      isLoading.value = true
      error.value = null
      await authService.initializeAuth()
      user.value = await authService.getUser()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize auth'
      console.error('Auth initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Login
  const login = async () => {
    try {
      isLoading.value = true
      error.value = null
      await authService.login()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      console.error('Login error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Handle callback
  const handleCallback = async () => {
    try {
      isLoading.value = true
      error.value = null
      const callbackUser = await authService.handleCallback()
      user.value = callbackUser
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Callback handling failed'
      console.error('Callback error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null
      user.value = null
      await authService.logout()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      console.error('Logout error:', err)
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Refresh token
  const refreshToken = async () => {
    try {
      error.value = null
      user.value = await authService.refreshToken()
      return !!user.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Token refresh failed'
      console.error('Refresh error:', err)
      return false
    }
  }

  // Update user from service
  const updateUser = async () => {
    try {
      user.value = await authService.getUser()
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    userName,
    userEmail,
    accessToken,
    // Methods
    initializeAuth,
    login,
    handleCallback,
    logout,
    refreshToken,
    updateUser,
    clearError,
  }
})
