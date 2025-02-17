<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-opacity-50 transition-opacity"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
      >
        <!-- Close button -->
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button
            @click="closeModal"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 class="text-base font-semibold leading-6 text-gray-900">{{ product.name }}</h3>

            <hr class="my-4 border-gray-300" />
            <!-- Product Details -->
            <div class="mt-4">
              <p class="mt-2 text-sm text-gray-500">Price: R{{ product.price.toFixed(2) }}</p>
              <p class="mt-1 text-sm text-gray-500">Available: {{ product.quantity }} units</p>

              <!-- Current Cart Info -->
              <p v-if="currentCartQuantity" class="mt-2 text-sm text-blue-600">
                Currently in cart: {{ currentCartQuantity }} units
              </p>

              <!-- Quantity Selector -->
              <div class="mt-4">
                <label for="quantity" class="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <select
                  id="quantity"
                  v-model="selectedQuantity"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm cursor-pointer"
                >
                  <option v-for="n in product.quantity" :key="n" :value="n">
                    {{ n }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr class="my-4 border-gray-300" />
        <!-- Actions (Edit Cart, Add to Cart, Remove from Cart ) -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            v-if="!currentCartQuantity"
            type="button"
            @click="addToCartAndClose"
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            v-else
            type="button"
            @click="updateCartAndClose"
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto cursor-pointer"
          >
            Update Cart
          </button>
          <button
            v-if="currentCartQuantity"
            type="button"
            @click="removeFromCartAndClose"
            class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
          >
            Remove from Cart
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'

const props = defineProps({
  show: Boolean,
  product: Object,
})

const emit = defineEmits(['close', 'addToCart', 'updateCart', 'removeFromCart'])
const cartStore = useShoppingCartStore()

const selectedQuantity = ref(1)

// Get current cart quantity for this product
const currentCartQuantity = computed(() => {
  if (!props.product) return 0
  const cartItem = cartStore.cartItems.find((item) => item.id === props.product.id)
  return cartItem ? cartItem.quantity : 0
})

// Set initial quantity to current cart quantity if product is in cart
const initializeQuantity = () => {
  if (currentCartQuantity.value > 0) {
    selectedQuantity.value = currentCartQuantity.value
  } else {
    selectedQuantity.value = 1
  }
}

// Initialize quantity when modal opens
watch(
  () => props.show,
  (newValue) => {
    if (newValue) initializeQuantity()
  },
)

const closeModal = () => {
  selectedQuantity.value = 1
  emit('close')
}

const addToCartAndClose = () => {
  emit('addToCart', {
    ...props.product,
    quantity: selectedQuantity.value,
  })
  closeModal()
}

const updateCartAndClose = () => {
  cartStore.updateQuantity(props.product.id, selectedQuantity.value)
  closeModal()
}

const removeFromCartAndClose = () => {
  cartStore.removeFromCart(props.product.id)
  closeModal()
}
</script>
