<template>
  <!--
    Main navigation component - handles site-wide navigation with:
    - Responsive design (desktop/mobile layouts)
    - Authentication features (login/register/logout)
    - Shopping cart functionality
    - Search integration
    - User menu
  -->
  <nav class="bg-slate-100 sticky top-0 z-50 mt-4 transition-all duration-800 ease-in-out">
    <!-- Desktop Navigation Layout -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section - Links to Home -->
        <div class="flex-shrink-0 flex items-center">
          <div
            class="flex-shrink-0 flex items-center cursor-pointer"
            @click="router.push('/')"
            title="Go to Home"
          >
            <img src="@/assets/lister-logo-black.svg" alt="Lister Logo" class="h-8 w-auto" />
          </div>
        </div>

        <!-- Desktop Search Bar - Center Aligned -->
        <div class="hidden md:flex flex-1 justify-center px-8">
          <SearchBar />
        </div>

        <!-- Desktop Right Menu - User and Cart Controls -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- User Account Icon and Dropdown -->
          <div class="relative">
            <button
              class="p-2 rounded-full hover:bg-gray-100"
              @click="toggleUserMenu"
              ref="userMenuButton"
            >
              <UserIcon class="h-6 w-6 text-gray-600" :class="{ 'fill-current': user }" />
            </button>

            <!-- User Dropdown Menu - Authentication Actions -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <!-- Authenticated User Menu -->
              <div v-if="user">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm text-gray-600">Welcome,</p>
                  <p class="font-medium text-gray-800">{{ user.email }}</p>
                </div>
                <ul>
                  <li>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="navigateTo('/account')"
                    >
                      My Account
                    </button>
                  </li>
                  <li>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="navigateTo('/favorites')"
                    >
                      Favorites
                    </button>
                  </li>
                  <li>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      @click="confirmLogout"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
              <!-- Guest User Menu Options -->
              <div v-else>
                <ul>
                  <li>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showLoginDialog = true"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showRegistrationDialog = true"
                    >
                      Register
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Icon and Dropdown -->
          <div class="relative group">
            <button
              class="p-2 rounded-full cursor-pointer hover:bg-gray-100 relative"
              @click="handleCart"
              ref="cartButton"
            >
              <ShoppingCartIcon
                class="h-6 w-6 text-gray-600"
                :class="{ 'fill-current': cartStore.cartItems.length > 0 }"
              />
              <!-- Cart Item Count Badge -->
              <span
                v-if="cartStore.cartItems.length > 0"
                class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.cartItems.length }}
              </span>
            </button>

            <!-- Shopping Cart Dropdown Panel -->
            <div
              ref="cartDropdown"
              v-show="isCartOpen"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 z-50"
            >
              <!-- Cart Header -->
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700">Shopping Cart</h3>
              </div>

              <!-- Cart Items List with Scrollable Container -->
              <div class="max-h-96 overflow-y-auto">
                <div v-if="cartStore.cartItems.length === 0" class="p-4 text-center text-gray-500">
                  Your cart is empty
                </div>

                <div v-else>
                  <!-- Individual Cart Item Display -->
                  <div
                    v-for="item in cartStore.cartItems"
                    :key="item.id"
                    class="p-4 border-b border-gray-100 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                    @click="openEditModal(item)"
                  >
                    <!-- Product Image with Loading State -->
                    <div class="relative w-16 h-16 flex-shrink-0">
                      <img
                        :src="getImageUrl(item)"
                        :alt="item.product_name || item.name"
                        class="w-full h-full object-cover rounded transition-opacity duration-300"
                        :class="{
                          'opacity-0':
                            !imageLoaded[item.id] && getImageUrl(item) !== '/placeholder.jpg',
                        }"
                        @load="handleImageLoad(item.id)"
                        @error="handleImageError(item.id)"
                      />
                      <!-- Loading Placeholder Animation -->
                      <div
                        v-if="!imageLoaded[item.id]"
                        class="absolute inset-0 bg-gray-100 rounded animate-pulse"
                      ></div>
                    </div>

                    <!-- Product Details (Name, Quantity, Price) -->
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-800">{{ item.name }}</h4>
                      <div class="flex justify-between items-center mt-1">
                        <span class="text-sm text-gray-600">Qty: {{ item.quantity }}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-800"
                            >R{{ (item.price * item.quantity).toFixed(2) }}</span
                          >
                          <!-- Remove Item Button -->
                          <button
                            @click.stop="confirmRemoveItem(item)"
                            class="p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                          >
                            <TrashIcon class="h-4 w-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cart Footer with Total and Checkout -->
              <div class="p-4 border-t border-gray-200">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-sm font-medium text-gray-600">Total</span>
                  <span class="text-lg font-semibold text-gray-800"
                    >R{{ cartStore.getCartTotal().toFixed(2) }}</span
                  >
                </div>

                <!-- Checkout Button - Disabled when cart is empty -->
                <button
                  @click="handleCheckout"
                  :disabled="!cartHasItems"
                  class="w-full bg-blue-500 text-white py-2 cursor-pointer px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 checkout-button"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Panel - Shown when menu is toggled open -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Mobile Search -->
        <div class="relative px-2 mb-4">
          <SearchBar placeholder="Search..." />
        </div>

        <!-- Mobile Action Buttons -->
        <div class="flex justify-around">
          <button
            @click="handleLogin"
            class="flex flex-col items-center p-2 rounded-md hover:bg-gray-100"
          >
            <UserIcon class="h-6 w-6 text-gray-600" :class="{ 'fill-current': user }" />
            <span class="text-sm text-gray-600">Login</span>
          </button>
          <button
            @click="handleCart"
            class="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 relative"
          >
            <div class="relative">
              <ShoppingCartIcon
                class="h-6 w-6 text-gray-600"
                :class="{ 'fill-current': cartStore.cartItems.length > 0 }"
              />
              <span
                v-if="cartStore.cartItems.length > 0"
                class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.cartItems.length }}
              </span>
            </div>
            <span class="text-sm text-gray-600">Cart</span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Modal Components - Included at root level -->
  <!-- Cart Item Edit Modal -->
  <AddToCartModal :show="showEditModal" :product="selectedProduct" @close="closeEditModal" />

  <!-- Item Removal Confirmation Dialog -->
  <ConfirmationDialog
    :show="showConfirmDialog"
    title="Remove Item"
    message="Are you sure you want to remove this item from your cart?"
    @confirm="removeConfirmedItem"
    @cancel="cancelRemoveItem"
  />

  <!-- User Registration Dialog -->
  <UserRegistrationDialog
    :show="showRegistrationDialog"
    @close="showRegistrationDialog = false"
    @open-login="openLoginFromRegistration"
  />

  <!-- Logout Confirmation Dialog -->
  <ConfirmationDialog
    :show="showLogoutDialog"
    title="Confirm Logout"
    message="Are you sure you want to logout?"
    :loading="isLoggingOut"
    confirm-text="Logout"
    @confirm="handleLogout"
    @cancel="showLogoutDialog = false"
  />

  <!-- User Login Dialog -->
  <UserLogin
    :is-open="showLoginDialog"
    @close="showLoginDialog = false"
    @open-registration="openRegistrationFromLogin"
  />
</template>

<script setup>
/**
 * MainNavigation Component
 *
 * Central navigation component for the e-commerce application that provides:
 * - User authentication controls (login/register/logout)
 * - Shopping cart functionality with item management
 * - Search integration
 * - Responsive design for desktop and mobile
 * - Navigation to key application areas
 */

// Store imports for cart and authentication state management
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import { storeToRefs } from 'pinia'

// Vue core functionality
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Component imports for modals and UI elements
import AddToCartModal from '@/components/modals/AddToCartModal.vue'
import ConfirmationDialog from '@/components/modals/ConfirmationDialog.vue'
import UserRegistrationDialog from '@/components/authentication/UserRegistrationDialog.vue'
import UserLogin from '@/components/authentication/UserLoginDialog.vue'
import SearchBar from '@/components/search/SearchBar.vue'

// Heroicons import for UI icons
import {
  UserIcon,
  ShoppingCartIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// ------------------------------------------------------------
// Store and Router Initialization
// ------------------------------------------------------------

const cartStore = useShoppingCartStore()
const authStore = useAuthStore()
const router = useRouter()

// ------------------------------------------------------------
// Reactive State (refs)
// ------------------------------------------------------------

// UI State Controls
const isMenuOpen = ref(false) // Controls mobile menu visibility
const isCartOpen = ref(false) // Controls cart dropdown visibility
const showUserMenu = ref(false) // Controls user menu dropdown visibility

// Modal Controls
const showEditModal = ref(false) // Controls cart item edit modal
const showConfirmDialog = ref(false) // Controls item removal confirmation
const showRegistrationDialog = ref(false) // Controls registration dialog
const showLoginDialog = ref(false) // Controls login dialog
const showLogoutDialog = ref(false) // Controls logout confirmation dialog

// Data Refs
const selectedProduct = ref(null) // Currently selected product for editing
const itemToRemove = ref(null) // Item to be removed from cart
const isLoggingOut = ref(false) // Loading state for logout process
const imageLoaded = ref({}) // Tracks image loading status by product ID

// DOM Element References (for click outside detection)
const userMenuButton = ref(null)
const cartButton = ref(null)
const cartDropdown = ref(null)

// ------------------------------------------------------------
// Refs from Stores (External State)
// ------------------------------------------------------------

// Get user from auth store to determine authentication state
const { user } = storeToRefs(authStore)

// ------------------------------------------------------------
// Computed Properties
// ------------------------------------------------------------

// Determines if cart has items to enable/disable checkout button
const cartHasItems = computed(() => cartStore.cartItems.length > 0)

// ------------------------------------------------------------
// Authentication Methods
// ------------------------------------------------------------

// Opens login dialog (primarily for mobile view)
const handleLogin = () => {
  showRegistrationDialog.value = true
}

// Switches from registration to login dialog
const openLoginFromRegistration = () => {
  showRegistrationDialog.value = false
  showLoginDialog.value = true
}

// Switches from login to registration dialog
const openRegistrationFromLogin = () => {
  showLoginDialog.value = false
  showRegistrationDialog.value = true
}

// Shows logout confirmation dialog
const confirmLogout = () => {
  showLogoutDialog.value = true
  closeUserMenu()
}

// Handles the actual logout process
const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await authStore.signOut()
    showLogoutDialog.value = false
    router.push('/')
    showAlert('Successfully logged out!', 'success')
  } catch (error) {
    console.error('Logout failed:', error)
    showAlert('Logout failed', 'error')
  } finally {
    isLoggingOut.value = false
  }
}

// ------------------------------------------------------------
// Shopping Cart Methods
// ------------------------------------------------------------

// Toggles the cart dropdown visibility
const handleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

// Navigates to checkout page and closes cart
const handleCheckout = () => {
  router.push('/checkout')
  isCartOpen.value = false
}

// Opens the edit modal for a cart item
const openEditModal = (item) => {
  selectedProduct.value = {
    ...item,
    quantity: cartStore.cartItems.find((i) => i.id === item.id)?.quantity || 0,
  }
  showEditModal.value = true
}

// Closes the edit modal
const closeEditModal = () => {
  showEditModal.value = false
  selectedProduct.value = null
}

// Shows confirmation dialog before removing item from cart
const confirmRemoveItem = (item) => {
  itemToRemove.value = item
  showConfirmDialog.value = true
  isCartOpen.value = false
}

// Removes item from cart after confirmation
const removeConfirmedItem = () => {
  if (itemToRemove.value) {
    cartStore.removeFromCart(itemToRemove.value.id)
    itemToRemove.value = null
  }
  showConfirmDialog.value = false
}

// Cancels the remove item operation
const cancelRemoveItem = () => {
  itemToRemove.value = null
  showConfirmDialog.value = false
}

// ------------------------------------------------------------
// User Menu Methods
// ------------------------------------------------------------

// Toggles user menu dropdown visibility
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Closes user menu dropdown
const closeUserMenu = () => {
  showUserMenu.value = false
}

// Navigates to a path and closes user menu
const navigateTo = (path) => {
  router.push(path)
  showUserMenu.value = false
}

// Closes the cart dropdown
const closeCart = () => {
  isCartOpen.value = false
}

// ------------------------------------------------------------
// Outside Click Handling (for dropdowns)
// ------------------------------------------------------------

// Handles clicks outside menus to close them
const handleClickOutside = (event) => {
  // Close user menu if click is outside user menu button
  if (showUserMenu.value && !userMenuButton.value?.contains(event.target)) {
    closeUserMenu()
  }
  // Close cart if click is outside cart button and dropdown
  if (
    isCartOpen.value &&
    !cartDropdown.value?.contains(event.target) &&
    !cartButton.value?.contains(event.target)
  ) {
    closeCart()
  }
}

// ------------------------------------------------------------
// Image Handling
// ------------------------------------------------------------

// Gets image URL for a product with fallback to placeholder
const getImageUrl = (product) => {
  return product.product_image && product.product_image[0]
    ? product.product_image[0].url
    : '/placeholder.jpg'
}

// Marks image as loaded when it completes loading
const handleImageLoad = (productId) => {
  imageLoaded.value[productId] = true
}

// Handles image loading errors
const handleImageError = (productId) => {
  imageLoaded.value[productId] = true
}

// ------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------

/**
 * Shows an application alert
 * @param {string} message - Alert message to display
 * @param {string} type - Alert type (success, error, warning, info)
 * @param {number} timeout - Time in ms before alert auto-dismisses
 */
const showAlert = (message, type = 'success', timeout = 3000) => {
  window.dispatchEvent(
    new CustomEvent('show-alert', {
      detail: { message, type, timeout },
    }),
  )
}

// ------------------------------------------------------------
// Lifecycle Hooks
// ------------------------------------------------------------

// Setup click outside detection on component mount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listeners on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Styling for disabled checkout button */
.checkout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
