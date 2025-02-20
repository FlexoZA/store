<template>
  <!-- Loading State -->
  <div class="mt-12" v-if="loading">
    <ProductSkeleton />
  </div>

  <!-- Error State -->
  <div v-else-if="error">Error: {{ error }}</div>

  <!-- Main Content -->
  <div v-else>
    <!-- Products Grid -->
    <div
      class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      <!-- Product Card -->
      <div v-for="product in products" :key="product.id" class="group relative">
        <a href="#">
          <!-- Product Image Container with Relative Positioning -->
          <div class="relative">
            <img
              :src="product.product_image?.[0]?.url || '@/assets/products/alt/C_trunking.jpg'"
              :alt="product.name"
              class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
            />
            <!-- Out of Stock Banner -->
            <div
              v-if="product.quantity <= 0"
              class="absolute bottom-0 left-0 right-0 bg-red-400 text-white text-center py-1 text-sm font-medium rounded-b-lg"
            >
              Out of Stock
            </div>
          </div>

          <!-- Product Details -->
          <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
          <div class="mt-1 flex items-center justify-between">
            <p class="text-lg font-medium text-gray-900">R{{ product.price.toFixed(2) }}</p>

            <!-- Action Buttons (Cart & Wishlist) -->
            <div class="flex gap-2">
              <!-- Add to Cart Button -->
              <button
                class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-pointer transition-all"
                :class="{
                  'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400':
                    product.quantity <= 0,
                  'text-gray-400': isInCart(product.id),
                }"
                @click.prevent="product.quantity > 0 && openAddToCartModal(product)"
                :disabled="product.quantity <= 0"
                :title="product.quantity <= 0 ? 'Out of stock' : ''"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :fill="isInCart(product.id) ? 'currentColor' : 'none'"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>

              <!-- Wishlist Button -->
              <button
                class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-pointer transition-all"
                @click.prevent="toggleWishlist(product)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <!-- Mobile Pagination -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>

      <!-- Desktop Pagination -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Page Information -->
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">{{ currentPage }}</span> of
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>

        <!-- Pagination Navigation -->
        <div>
          <nav class="isolate inline-flex -space-x-px" aria-label="Pagination">
            <!-- Previous Page Button -->
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Page Numbers -->
            <template v-for="page in totalPages" :key="page">
              <button
                @click="handlePageChange(page)"
                type="button"
                :class="[
                  'px-4 py-2 text-sm font-semibold focus:outline-none cursor-pointer',
                  page === currentPage ? 'text-black' : 'text-gray-500 hover:text-black',
                ]"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next Page Button -->
            <button
              type="text"
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add to Cart Modal -->
    <AddToCartModal
      :show="showAddToCartModal"
      :product="selectedProduct"
      @close="showAddToCartModal = false"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
// Imports
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/supabase/productsStore'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import ProductSkeleton from '@/components/loaders/productSkeleton.vue'
import AddToCartModal from '@/components/modals/AddToCartModal.vue'

// Store Initialization
const store = useProductsStore()
const cartStore = useShoppingCartStore()
const { products, loading, error, currentPage, totalPages } = storeToRefs(store)
const { isInCart } = cartStore

// Page Navigation Handler
const handlePageChange = async (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    await store.getProducts(newPage)
    // Add a small delay before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
      })
    }, 0)
  }
}

// Cart and Wishlist Functions
const showAddToCartModal = ref(false)
const selectedProduct = ref(null)

const openAddToCartModal = (product) => {
  selectedProduct.value = product
  showAddToCartModal.value = true
}

const handleAddToCart = (productWithQuantity) => {
  if (cartStore.isInCart(productWithQuantity.id)) {
    cartStore.updateQuantity(productWithQuantity.id, productWithQuantity.quantity)
  } else {
    cartStore.addToCart(productWithQuantity)
  }
  showAddToCartModal.value = false
}

const toggleWishlist = (product) => {
  // TODO: Implement wishlist functionality
  console.log('Toggle wishlist for product:', product.id)
}

// Lifecycle Hooks
onMounted(async () => {
  await store.getProducts()
})
</script>
