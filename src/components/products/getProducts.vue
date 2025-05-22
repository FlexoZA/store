<template>
  <!-- Loading State -->
  <div class="mt-12" v-if="loading">
    <!-- Featured Product Skeleton (only on page 1) -->
    <FeaturedProductSkeleton v-if="currentPage === 1" class="mb-12" />
    <!-- Regular Products Skeleton -->
    <ProductSkeleton />
  </div>

  <!-- Error State -->
  <div v-else-if="error">Error: {{ error }}</div>

  <!-- Main Content -->
  <div v-else>
    <!-- Featured Products (Only shown on page 1 and when no category is selected) -->
    <div
      v-if="currentPage === 1 && featuredProducts.length > 0 && !selectedCategoryId"
      class="mb-12"
    >
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Featured Products</h2>
      <div
        v-for="(product, index) in featuredProducts"
        :key="'featured-' + product.id"
        class="mb-8"
      >
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Image -->
          <div class="aspect-square overflow-hidden rounded-lg relative">
            <img
              :src="getImageUrl(product)"
              class="h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in"
            />
            <!-- Out of Stock Banner -->
            <div
              v-if="product.quantity <= 0"
              class="absolute bottom-0 left-0 right-0 bg-red-400 text-white text-center py-1 text-sm font-medium"
            >
              Out of Stock
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex flex-col justify-between">
            <div>
              <!-- Title -->
              <h3 class="text-2xl font-bold text-gray-900">{{ product.product_name }}</h3>
              <!-- Description -->
              <p class="mt-4 text-lg text-gray-500">
                {{ product.description }}
              </p>
              <!-- Specifications -->
              <ul class="mt-4 space-y-2 text-gray-600 list-disc pl-5">
                <li v-for="(feature, index) in product.product_features" :key="index">
                  {{ feature.feature }}
                </li>
              </ul>

              <!-- Action Buttons -->
              <div class="mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block mr-4"
                >
                  Read More
                </a>
                <a
                  href="#"
                  class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block mr-4"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block"
                >
                  3D View
                </a>
              </div>
              <hr class="mt-12 bg-gray-300 h-0.5 border-none" />
              <p class="mt-6 text-l font-bold text-gray-900 text-right">
                R{{ formatPrice(product.price) }}
              </p>
            </div>

            <!-- Icons -->
            <div class="mt-6 flex justify-end gap-4">
              <button
                class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                @click.prevent="toggleWishlist(product)"
              >
                <HeartIcon class="h-6 w-6" />
              </button>
              <button
                class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                @click.prevent="product.quantity > 0 && openAddToCartModal(product)"
                :disabled="product.quantity <= 0"
              >
                <ShoppingCartIcon
                  class="h-6 w-6"
                  :class="{ 'fill-current': isInCart(product.id) }"
                />
              </button>
            </div>
          </div>
        </div>
        <!-- Add divider between featured products, but not after the last one -->
        <hr v-if="index < featuredProducts.length - 1" class="mt-8 bg-gray-300 h-0.5 border-none" />
      </div>
      <hr class="mt-12 bg-gray-300 h-0.5 border-none" />
    </div>

    <!-- Category Filter -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">Products</h2>
      </div>
      <div class="flex items-center">
        <label for="category-filter" class="mr-2 text-sm font-medium text-gray-700"
          >Filter by:</label
        >
        <div class="relative w-48">
          <select
            id="category-filter"
            v-model="selectedCategoryId"
            @change="handleCategoryChange"
            class="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option :value="null">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.category_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div
      class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      <!-- Product Card -->
      <div v-for="product in regularProducts" :key="product.id" class="group relative">
        <router-link :to="`/product/${product.id}`">
          <!-- Product Image Container with Relative Positioning -->
          <div class="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <!-- Product Image -->
            <img
              :src="getImageUrl(product)"
              class="h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in"
              loading="lazy"
            />

            <!-- Out of Stock Banner -->
            <div
              v-if="product.quantity <= 0"
              class="absolute bottom-0 left-0 right-0 bg-red-400 text-white text-center py-1 text-sm font-medium"
            >
              Out of Stock
            </div>
          </div>

          <!-- Product Details -->
          <h3 class="mt-4 text-sm text-gray-700">{{ product.product_name }}</h3>
          <div class="mt-1 flex items-center justify-between">
            <p class="text-lg font-medium text-gray-900">R{{ formatPrice(product.price) }}</p>

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
                <ShoppingCartIcon
                  :class="{ 'fill-current': isInCart(product.id) }"
                  class="w-5 h-5"
                />
              </button>

              <!-- Wishlist Button -->
              <button
                class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-pointer transition-all"
                @click.prevent="toggleWishlist(product)"
              >
                <HeartIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </router-link>
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
              <ChevronLeftIcon class="h-5 w-5" />
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
              <ChevronRightIcon class="h-5 w-5" />
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
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/supabase/productsStore'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import ProductSkeleton from '@/components/loaders/productSkeleton.vue'
import FeaturedProductSkeleton from '@/components/loaders/featuredProductSkeleton.vue'
import AddToCartModal from '@/components/modals/AddToCartModal.vue'
import { formatPrice } from '@/utils/priceUtils'
import {
  ShoppingCartIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

// Store Initialization
const store = useProductsStore()
const cartStore = useShoppingCartStore()
const {
  products,
  featuredProducts,
  loading,
  error,
  currentPage,
  totalPages,
  categories,
  selectedCategory,
} = storeToRefs(store)
const { isInCart } = cartStore

// No need to filter featured products anymore, use them directly from the store
// const featuredProducts = computed(() => {
//   return products.value.filter((product) => product.is_featured === true)
// })

const regularProducts = computed(() => {
  // Show all products in the regular product list, regardless of featured status
  return products.value
})

// Category filter handling
const selectedCategoryId = ref(null)

// Keep selectedCategoryId in sync with store
watch(selectedCategory, (newCategory) => {
  selectedCategoryId.value = newCategory
})

const handleCategoryChange = async () => {
  // Reset to first page when changing category filter
  window.scrollTo({ top: 0 })
  await new Promise((resolve) => setTimeout(resolve, 100))
  await store.getProducts(1, selectedCategoryId.value)
}

// Page Navigation Handler
const handlePageChange = async (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0 })
    await new Promise((resolve) => setTimeout(resolve, 100))
    await store.getProducts(newPage, selectedCategoryId.value)
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

// Simplify image URL helper
const getImageUrl = (product) => {
  if (!product?.product_image?.[0]?.url) {
    return '/placeholder.jpg'
  }
  // Fix double slashes in URL
  return product.product_image[0].url.replace(/\/+/g, '/')
}

// Lifecycle Hooks
onMounted(async () => {
  // Fetch categories first
  await store.getCategories()

  // Then fetch products (without category filter initially)
  await store.getProducts()
})
</script>
