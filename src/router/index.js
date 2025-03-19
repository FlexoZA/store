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
        requiresAdmin: true,
        layout: 'admin',
      },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../components/admin/dashboard/DashboardOverview.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../components/admin/products/AdminProducts.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../components/admin/orders/AdminOrders.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../components/admin/users/AdminUsers.vue'),
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../components/admin/settings/AdminSettings.vue'),
        },
      ],
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
    return
  }

  // If route requires admin role, check admin status
  if (requiresAdmin) {
    const isAdmin = await authStore.hasAdminRole()
    if (!currentUser || !isAdmin) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

export default router
