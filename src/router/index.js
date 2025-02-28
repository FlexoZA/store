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
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/cart/cartCheckout.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
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

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !authStore.getCurrentUser()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
