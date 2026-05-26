# IdentityServer OIDC Quick Reference

## What Was Implemented

A complete OIDC authentication system with IdentityServer integration including:

✅ **Authentication Service** - Manages OIDC client and login/logout flows  
✅ **Pinia Auth Store** - Global state for user and authentication  
✅ **Route Guards** - Automatic protection for authenticated routes  
✅ **Token Management** - Automatic refresh and expiration handling  
✅ **API Integration** - Auth token automatically added to HTTP requests  
✅ **UI Components** - Login/logout button with user info display  

---

## Quick Start (3 Steps)

### 1. **Update Environment Variables**
Create `.env.local`:
```bash
VITE_OIDC_AUTHORITY=https://your-identityserver.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OIDC_SILENT_REDIRECT_URI=http://localhost:5173/auth/silent-callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
```

### 2. **Register Client in IdentityServer**
```csharp
new Client {
    ClientId = "product-frontend",
    AllowedGrantTypes = GrantTypes.Code,
    RequirePkce = true,
    RequireClientSecret = false,
    RedirectUris = { "http://localhost:5173/auth/callback" },
    AllowedCorsOrigins = { "http://localhost:5173" },
    PostLogoutRedirectUris = { "http://localhost:5173" },
    AllowedScopes = { "openid", "profile", "email" }
}
```

### 3. **Test It**
```bash
npm run dev
# Navigate to /products (protected route)
# Should redirect to IdentityServer login
```

---

## Usage in Components

### Option A: useAuth Composable (Recommended)
```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user, login, logout } = useAuth()
</script>

<template>
  <button v-if="!isAuthenticated" @click="login">Login</button>
  <button v-else @click="logout">Logout ({{ user?.profile.name }})</button>
</template>
```

### Option B: Auth Store
```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <button @click="authStore.login" v-if="!authStore.isAuthenticated">Login</button>
  <button @click="authStore.logout" v-else>Logout</button>
</template>
```

### Option C: UserProfile Component
```vue
<template>
  <UserProfile /> <!-- Handles login/logout + user display -->
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
</script>
```

---

## File Structure

```
src/
├── components/
│   └── UserProfile.vue           # Login/logout UI
├── composables/
│   ├── useAuth.ts                # Auth composable hook
│   └── useCounter.ts
├── config/
│   └── oidc.ts                   # OIDC configuration
├── services/
│   └── authService.ts            # OIDC client wrapper
├── stores/
│   ├── auth.ts                   # Auth state (Pinia)
│   ├── counter.ts
│   └── product.ts
├── views/
│   ├── AuthCallback.vue          # Callback handler
│   └── ...
├── router/
│   └── index.ts                  # Routes with guards
├── utils/
│   └── http.ts                   # API client (auth interceptor added)
└── App.vue                        # Updated with auth init

public/
└── auth/
    └── silent-callback.html      # Token refresh callback
```

---

## Protected Routes

Current protected routes require authentication:
- `/products` - Product list
- `/products/add` - Add product  
- `/products/:id` - Product detail

Unauthenticated users are automatically redirected to IdentityServer login.

---

## API Requests

Your API client (`http.ts`) automatically includes the auth token:

```typescript
// This will automatically include Authorization header
import http from '@/utils/http'

const response = await http.get('/api/products')
// Request sent with: Authorization: Bearer <access_token>
```

---

## Available Auth Methods

```typescript
// Get user/token info
const { user, accessToken, isAuthenticated } = useAuth()

// Login/Logout
const { login, logout } = useAuth()

// Token refresh
const { refreshToken } = useAuth()

// Get access token directly
const { getAccessToken } = useAuth()

// Manage errors
const { error, clearError } = useAuth()
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Redirect URI mismatch | Check `.env.local` matches IdentityServer client config |
| CORS errors | Add your app origin to `AllowedCorsOrigins` |
| Not redirecting to login | Check `meta: { requiresAuth: true }` on route |
| Token not in API calls | Verify `http.ts` interceptor is running |
| Silent refresh failing | Check `silent-callback.html` exists in public/auth/ |

---

## Next Steps

1. ✅ Configure environment variables
2. ✅ Register client in IdentityServer  
3. ✅ Test login flow
4. ✅ Add any custom scopes/claims
5. ✅ Customize `UserProfile` component styling
6. ✅ Add role-based access control (optional)

See **OIDC_SETUP.md** for complete documentation.
