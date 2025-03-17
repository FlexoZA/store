import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/authentication/authenticationStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { layout: 'default' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/cart/cartCheckout.vue'),
      meta: {
        requiresAuth: true,
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: {
        requiresAuth: true,
        layout: 'admin',
      },
    },
  ],
})

// Store initialization flag
let isAuthInitialized = false

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (!isAuthInitialized) {
    await authStore.initialize()
    isAuthInitialized = true
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const currentUser = authStore.getCurrentUser()

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !currentUser) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // If route requires admin role and user doesn't have it, redirect to home
  else if (requiresAdmin && (!currentUser || !authStore.hasAdminRole())) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
