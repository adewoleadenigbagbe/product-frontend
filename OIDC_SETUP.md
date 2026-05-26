# IdentityServer OIDC Integration Guide

This guide explains how to use the OIDC authentication integration with IdentityServer in your Vue.js application.

## Overview

The application now includes complete OIDC (OpenID Connect) support for authentication with IdentityServer. This includes:

- **Automatic authentication**: Protected routes redirect to IdentityServer login
- **Token management**: Automatic token refresh and expiration handling
- **User state**: Global auth store with user information
- **Login/Logout UI**: Pre-built components for auth UI
- **Route guards**: Protection for authenticated routes

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Update the values with your IdentityServer configuration:

```env
VITE_OIDC_AUTHORITY=https://your-identityserver.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OIDC_SILENT_REDIRECT_URI=http://localhost:5173/auth/silent-callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
```

### 2. Register Your Client in IdentityServer

In your IdentityServer configuration, register a new client with:

```csharp
new Client
{
    ClientId = "product-frontend",
    ClientName = "Product Frontend",
    AllowedGrantTypes = GrantTypes.Code,
    RequirePkce = true,
    RequireClientSecret = false, // Public client (SPA)
    
    RedirectUris = { "http://localhost:5173/auth/callback" },
    AllowedCorsOrigins = { "http://localhost:5173" },
    PostLogoutRedirectUris = { "http://localhost:5173" },
    
    AllowedScopes = { 
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        IdentityServerConstants.StandardScopes.Email,
    }
}
```

### 3. (Optional) Add Custom Claims/Scopes

If you need additional claims beyond `openid`, `profile`, and `email`, update:

1. In IdentityServer - add scope definition:
```csharp
new ApiScope
{
    Name = "product-api",
    DisplayName = "Product API",
    UserClaims = { "role", "permission" }
}
```

2. In the app - update scope in `src/config/oidc.ts`:
```typescript
scope: 'openid profile email product-api',
```

## Usage in Components

### Using the `useAuth` Composable

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user, login, logout, accessToken } = useAuth()
</script>

<template>
  <div>
    <div v-if="isAuthenticated">
      <p>Welcome, {{ user.profile.name }}!</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <button @click="login">Login</button>
    </div>
  </div>
</template>
```

### Using the Auth Store Directly

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check if authenticated
if (authStore.isAuthenticated) {
  console.log('User:', authStore.user?.profile)
  console.log('Token:', authStore.accessToken)
}

// Login
await authStore.login()

// Logout
await authStore.logout()

// Refresh token
await authStore.refreshToken()
```

### UserProfile Component

The `UserProfile` component displays the current user info and login/logout buttons:

```vue
<template>
  <div>
    <!-- Include in your header/navbar -->
    <UserProfile />
  </div>
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
</script>
```

## Protected Routes

Routes marked with `meta: { requiresAuth: true }` will automatically redirect unauthenticated users to IdentityServer login.

Current protected routes:
- `/products` - Product list
- `/products/add` - Add product
- `/products/:id` - Product detail

To add protection to more routes, update `src/router/index.ts`:

```typescript
{
  path: '/my-route',
  name: 'MyRoute',
  component: () => import('../views/MyRoute.vue'),
  meta: { requiresAuth: true }  // Add this line
}
```

## API Calls with Authentication

To include the access token in API requests, update your HTTP client. Example with axios:

```typescript
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { accessToken } = useAuth()
  if (accessToken.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`
  }
  return config
})

export default api
```

Or update the existing `src/utils/http.ts`:

```typescript
import { useAuth } from '@/composables/useAuth'

// In request interceptor:
instance.interceptors.request.use((config) => {
  const { accessToken } = useAuth()
  if (accessToken.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`
  }
  return config
})
```

## Authentication Flow

1. **Initial Load**: App checks if user is logged in
2. **Protected Route Access**: If not authenticated, redirects to IdentityServer login
3. **Login**: User authenticates with IdentityServer
4. **Callback**: IdentityServer redirects to `/auth/callback` with authorization code
5. **Token Exchange**: App exchanges code for tokens (handled by oidc-client-ts)
6. **User Loaded**: User info and token stored in auth store
7. **Redirect**: User redirected to originally requested route
8. **Token Refresh**: Automatic background token refresh before expiration

## Logout Flow

1. User clicks logout button
2. App clears local session
3. Redirects to IdentityServer logout endpoint
4. IdentityServer clears session
5. Redirects back to app

## Troubleshooting

### CORS Errors
Make sure the `AllowedCorsOrigins` in IdentityServer includes your app's origin:
```csharp
AllowedCorsOrigins = { "http://localhost:5173", "https://yourdomain.com" }
```

### Redirect URI Mismatch
Ensure the redirect URIs in IdentityServer exactly match those in environment variables.

### Silent Refresh Not Working
Make sure:
1. `silent-callback.html` exists in `public/auth/`
2. The `VITE_OIDC_SILENT_REDIRECT_URI` env variable is set correctly
3. IdentityServer allows the silent redirect URI

### Tokens Not Being Sent
Check that the axios interceptor is properly configured to include the Authorization header with the access token.

## Files Modified/Created

- `src/config/oidc.ts` - OIDC configuration
- `src/services/authService.ts` - Auth service wrapper
- `src/stores/auth.ts` - Pinia auth store
- `src/composables/useAuth.ts` - Auth composable
- `src/components/UserProfile.vue` - User profile UI component
- `src/views/AuthCallback.vue` - Auth callback handler
- `src/router/index.ts` - Router with auth guards
- `public/auth/silent-callback.html` - Silent refresh callback
- `.env.example` - Environment variables template

## Next Steps

1. Update `.env.local` with your IdentityServer details
2. Register the client in IdentityServer
3. Test login flow by navigating to a protected route
4. Implement API authentication (see API Calls section above)
5. Customize scopes and claims as needed

## References

- [oidc-client-ts Documentation](https://github.com/authts/oidc-client-ts)
- [IdentityServer Documentation](https://docs.duendesoftware.com/)
- [OpenID Connect Spec](https://openid.net/connect/)
