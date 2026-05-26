/**
 * Authentication Service
 * Manages OIDC authentication with IdentityServer
 */

import { UserManager, UserManagerSettings, User } from 'oidc-client-ts'
import { oidcConfig } from '@/config/oidc'

class AuthService {
  private userManager: UserManager | null = null

  /**
   * Initialize the UserManager with OIDC configuration
   */
  async initializeAuth(): Promise<void> {
    if (this.userManager) return

    const settings: UserManagerSettings = {
      ...(oidcConfig as unknown as UserManagerSettings),
      // Client authentication method (post_body for confidential clients, none for public)
      client_secret: import.meta.env.VITE_OIDC_CLIENT_SECRET, // Optional, use if you have a client secret
    }

    this.userManager = new UserManager(settings)

    // Handle auth errors
    this.userManager.events.addAccessTokenExpired(async () => {
      console.log('Access token expired, attempting silent refresh...')
      try {
        await this.userManager!.signinSilent()
      } catch (error) {
        console.error('Silent refresh failed:', error)
        await this.logout()
      }
    })

    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user.profile)
    })

    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded')
    })

    this.userManager.events.addUserSignedOut(() => {
      console.log('User signed out')
    })
  }

  /**
   * Start OIDC login flow
   */
  async login(): Promise<void> {
    if (!this.userManager) await this.initializeAuth()
    return this.userManager!.signinRedirect()
  }

  /**
   * Handle callback from IdentityServer after login
   */
  async handleCallback(): Promise<User | null> {
    if (!this.userManager) await this.initializeAuth()
    try {
      const user = await this.userManager!.signinCallback()
      return !user ? null : user
    } catch (error) {
      console.error('Callback error:', error)
      throw error
    }
  }

  /**
   * Get current logged-in user
   */
  async getUser(): Promise<User | null> {
    if (!this.userManager) await this.initializeAuth()
    try {
      return await this.userManager!.getUser()
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  /**
   * Logout and redirect to IdentityServer logout endpoint
   */
  async logout(): Promise<void> {
    if (!this.userManager) await this.initializeAuth()
    try {
      // Clear local session
      const user = await this.userManager!.getUser()
      if (user) {
        await this.userManager!.signoutRedirect()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even on error, clear local state
      await this.userManager!.removeUser()
    }
  }

  /**
   * Refresh access token (silent renewal)
   */
  async refreshToken(): Promise<User | null> {
    if (!this.userManager) await this.initializeAuth()
    try {
      return await this.userManager!.signinSilent()
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    const user = await this.getUser()
    return user?.access_token || null
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser()
    return !!user && !user.expired
  }
}

// Export singleton instance
export const authService = new AuthService()
