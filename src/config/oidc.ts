/**
 * OIDC Configuration for IdentityServer
 * Update these values with your IdentityServer settings
 */

export const oidcConfig = {
  // IdentityServer endpoint - change to your IdentityServer URL
  authority: import.meta.env.VITE_OIDC_AUTHORITY || 'http://localhost:56035',
  
  // Application client ID - register in IdentityServer
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID || 'Product-Frontend',
  
  // Redirect URI after successful login
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI || `${window.location.origin}/auth/callback`,
  
  // Redirect URI for silent refresh
  silent_redirect_uri: import.meta.env.VITE_OIDC_SILENT_REDIRECT_URI || `${window.location.origin}/auth/silent-callback`,
  
  // Where to redirect after logout
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/logout`,
  
  // Response type (use 'code' for PKCE flow - recommended for SPAs)
  response_type: 'code',
  
  // Scope - what info to request from IdentityServer
  scope: 'openid profile trusted',
  
  // Use PKCE flow (required for SPAs)
  response_mode: 'query',
  
  // Additional settings
  loadUserInfo: true,
  automaticSilentRenew: true,
  silentRequestTimeoutInSeconds: 10,
  checkSessionInterval: 2000,
  // Retry user info requests every 5 seconds for up to 60 seconds
  userInfoRequestBackoffMilliseconds: 5000,
  userInfoRequestBackoffMultiplier: 1,
  userInfoRequestBackoffMaximumWaitTimeSeconds: 60,
}

export type OidcConfig = typeof oidcConfig
