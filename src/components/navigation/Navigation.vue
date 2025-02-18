<template>
  <nav class="bg-slate-100 sticky top-0 z-50 mt-4 transition-all duration-800 ease-in-out">
    <!-- Desktop Navigation -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <img src="@/assets/lister-logo-black.svg" alt="Lister Logo" class="h-8 w-auto" />
          </div>
        </div>

        <!-- Desktop Search Bar -->
        <div class="hidden md:flex flex-1 justify-center px-8">
          <div class="relative w-full max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>

        <!-- Desktop Right Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <button class="p-2 rounded-full hover:bg-gray-100" @click="handleLogin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <div class="relative group">
            <button class="p-2 rounded-full hover:bg-gray-100 relative" @click="handleCart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-600"
                :fill="cartStore.cartItems.length > 0 ? 'currentColor' : 'none'"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                v-if="cartStore.cartItems.length > 0"
                class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.cartItems.length }}
              </span>
            </button>

            <!-- Cart Dropdown -->
            <div
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 invisible group-hover:visible transition-all duration-300 z-50"
            >
              <!-- Cart Header -->
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700">Shopping Cart</h3>
              </div>

              <!-- Cart Items -->
              <div class="max-h-96 overflow-y-auto">
                <div v-if="cartStore.cartItems.length === 0" class="p-4 text-center text-gray-500">
                  Your cart is empty
                </div>

                <div v-else>
                  <div
                    v-for="item in cartStore.cartItems"
                    :key="item.id"
                    class="p-4 border-b border-gray-100 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                    @click="openEditModal(item)"
                  >
                    <!-- Product Image -->
                    <div class="w-16 h-16 flex-shrink-0">
                      <img
                        src="https://placehold.co/100x100"
                        :alt="item.name"
                        class="w-full h-full object-cover rounded"
                      />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-800">{{ item.name }}</h4>
                      <div class="flex justify-between items-center mt-1">
                        <span class="text-sm text-gray-600">Qty: {{ item.quantity }}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-800"
                            >R{{ (item.price * item.quantity).toFixed(2) }}</span
                          >
                          <button
                            @click.stop="confirmRemoveItem(item)"
                            class="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 text-gray-500 hover:text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cart Footer -->
              <div class="p-4 border-t border-gray-200">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-sm font-medium text-gray-600">Total</span>
                  <span class="text-lg font-semibold text-gray-800"
                    >R{{ cartStore.getCartTotal().toFixed(2) }}</span
                  >
                </div>

                <button
                  @click="handleCheckout"
                  :disabled="!cartHasItems"
                  class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 checkout-button"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg
              v-if="!isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Mobile Search -->
        <div class="relative px-2 mb-4">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
          />
        </div>

        <!-- Mobile Menu Items -->
        <div class="flex justify-around">
          <button
            @click="handleLogin"
            class="flex flex-col items-center p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-sm text-gray-600">Login</span>
          </button>
          <button
            @click="handleCart"
            class="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 relative"
          >
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-600"
                :fill="cartStore.cartItems.length > 0 ? 'currentColor' : 'none'"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
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

  <!-- Add these components at the end of the template section -->
  <AddToCartModal :show="showEditModal" :product="selectedProduct" @close="closeEditModal" />

  <ConfirmationDialog
    :show="showConfirmDialog"
    title="Remove Item"
    message="Are you sure you want to remove this item from your cart?"
    @confirm="removeConfirmedItem"
    @cancel="cancelRemoveItem"
  />
</template>

<script>
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AddToCartModal from '@/components/modals/AddToCartModal.vue'
import ConfirmationDialog from '@/components/modals/ConfirmationDialog.vue'

export default {
  name: 'NavigationBar',
  components: {
    AddToCartModal,
    ConfirmationDialog,
  },
  data() {
    return {
      isMenuOpen: false,
      searchQuery: '',
      showEditModal: false,
      showConfirmDialog: false,
      selectedProduct: null,
      itemToRemove: null,
    }
  },
  setup() {
    const cartStore = useShoppingCartStore()
    const { getCartCount } = storeToRefs(cartStore)
    const cartHasItems = computed(() => cartStore.cartItems.length > 0)
    return { cartStore, getCartCount, cartHasItems }
  },
  methods: {
    handleLogin() {
      // Implement login logic
      console.log('Login clicked')
    },
    handleCart() {
      // Implement cart logic
      console.log('Cart clicked')
    },
    handleCheckout() {
      console.log('Checkout clicked')
    },
    openEditModal(item) {
      this.selectedProduct = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: this.cartStore.cartItems.find((i) => i.id === item.id)?.quantity || 0,
      }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.selectedProduct = null
    },

    confirmRemoveItem(item) {
      this.itemToRemove = item
      this.showConfirmDialog = true
    },

    removeConfirmedItem() {
      if (this.itemToRemove) {
        this.cartStore.removeFromCart(this.itemToRemove.id)
        this.itemToRemove = null
      }
      this.showConfirmDialog = false
    },

    cancelRemoveItem() {
      this.itemToRemove = null
      this.showConfirmDialog = false
    },
  },
  watch: {
    searchQuery(newValue) {
      // Implement search logic
      console.log('Search query:', newValue)
    },
  },
}
</script>

<style scoped>
.checkout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
