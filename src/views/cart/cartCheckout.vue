<template>
  <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
    <h1 class="text-2xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>

    <div v-if="cartItems.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Cart items section -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Your Cart</h2>

        <ul class="divide-y divide-gray-200">
          <li v-for="item in cartItems" :key="item.id" class="py-4 flex">
            <div class="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md border border-gray-200">
              <img
                :src="getImageUrl(item)"
                :alt="item.product_name"
                class="h-full w-full object-cover object-center"
              />
            </div>

            <div class="ml-4 flex flex-1 flex-col">
              <div>
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <h3>{{ item.product_name || item.name }}</h3>
                  <p class="ml-4">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>

              <div class="flex flex-1 items-end justify-between text-sm">
                <p class="text-gray-500">Qty {{ item.quantity }}</p>

                <div class="flex">
                  <button
                    @click="showRemoveConfirmation(item)"
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{{ formatPrice(cartTotal) }}</p>
          </div>
        </div>
      </div>

      <!-- Checkout form section -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>

        <form class="space-y-4">
          <!-- Shipping form fields would go here -->
          <p class="text-gray-500 italic">Shipping form will be implemented in a future update.</p>

          <div class="mt-8">
            <button
              type="button"
              class="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Complete Purchase
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty cart state -->
    <div v-else class="text-center py-12">
      <h2 class="text-xl font-semibold mb-4">Your cart is empty</h2>
      <p class="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
      <router-link
        to="/"
        class="inline-block rounded-md bg-blue-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700"
      >
        Continue Shopping
      </router-link>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showDialog"
      :title="'Remove Item'"
      :message="dialogMessage"
      :loading="dialogLoading"
      confirmText="Remove"
      @confirm="confirmRemove"
      @cancel="cancelRemove"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import ConfirmationDialog from '@/components/modals/ConfirmationDialog.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { formatPrice } from '@/utils/priceUtils'

// Initialize store
const cartStore = useShoppingCartStore()

// Get cart items
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.getCartTotal())

// Dialog state
const showDialog = ref(false)
const dialogMessage = ref('')
const dialogLoading = ref(false)
const itemToRemove = ref(null)

// Helper function to get image URL with fallback
const getImageUrl = (product) => {
  return product?.product_image?.[0]?.url || '/placeholder.jpg'
}

// Show confirmation dialog before removing item
const showRemoveConfirmation = (item) => {
  itemToRemove.value = item
  dialogMessage.value = `Are you sure you want to remove "${item.product_name || item.name}" from your cart?`
  showDialog.value = true
}

// Handle removing item from cart after confirmation
const confirmRemove = () => {
  dialogLoading.value = true

  // Simulate a short delay to show loading state
  setTimeout(() => {
    if (itemToRemove.value) {
      cartStore.removeFromCart(itemToRemove.value.id)
      // Reset dialog state
      dialogLoading.value = false
      showDialog.value = false
      itemToRemove.value = null
    }
  }, 300)
}

// Cancel removal
const cancelRemove = () => {
  showDialog.value = false
  itemToRemove.value = null
}
</script>
