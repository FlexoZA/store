<template>
  <main>
    <div class="bg-slate-100">
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <!-- Loading State -->
        <div v-if="loading">
          <FeaturedProductSkeleton />
        </div>

        <!-- Error State -->
        <div v-else-if="error">
          <div class="text-red-600">Error: {{ error }}</div>
        </div>

        <!-- Main Content -->
        <div v-else-if="product">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <router-link to="/" class="hover:text-gray-900">Home</router-link>
              </li>
              <li class="flex items-center">
                <ChevronRightIcon class="h-4 w-4 mx-2" />
                <span class="text-gray-900">{{ product.product_name }}</span>
              </li>
            </ol>
          </nav>

          <!-- Product Grid -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <!-- Image -->
              <div class="aspect-square overflow-hidden rounded-lg relative bg-gray-100">
                <img
                  :src="getImageUrl(product)"
                  :alt="product.product_name"
                  class="h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-0 animate-fade-in"
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

              <!-- Product Info -->
              <div class="flex flex-col justify-between">
                <div>
                  <!-- Title -->
                  <h1 class="text-3xl font-bold text-gray-900">{{ product.product_name }}</h1>

                  <!-- Price -->
                  <p class="mt-4 text-2xl font-bold text-gray-900">
                    R{{ formatPrice(product.price) }}
                  </p>

                  <!-- Description -->
                  <p class="mt-4 text-lg text-gray-500">
                    {{ product.description }}
                  </p>

                  <!-- Specifications -->
                  <div class="mt-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                    <ul class="space-y-2 text-gray-600 list-disc pl-5">
                      <li v-for="(feature, index) in product.product_features" :key="index">
                        {{ feature.feature }}
                      </li>
                    </ul>
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-8 flex gap-4">
                    <a
                      href="#"
                      class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block"
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
                </div>

                <!-- Add to Cart Section -->
                <div class="mt-8">
                  <div class="flex items-center gap-4">
                    <button
                      class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      :disabled="product.quantity <= 0"
                      @click="openAddToCartModal(product)"
                    >
                      Add to Cart
                    </button>
                    <button
                      class="rounded-full p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors duration-200"
                      @click="toggleWishlist(product)"
                    >
                      <HeartIcon class="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
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
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/supabase/productsStore'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import FeaturedProductSkeleton from '@/components/loaders/featuredProductSkeleton.vue'
import AddToCartModal from '@/components/modals/AddToCartModal.vue'
import { formatPrice } from '@/utils/priceUtils'
import { HeartIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Store Initialization
const store = useProductsStore()
const cartStore = useShoppingCartStore()
const { loading, error } = storeToRefs(store)

// Route and Product Data
const route = useRoute()
const product = ref(null)

// Cart Modal State
const showAddToCartModal = ref(false)
const selectedProduct = ref(null)

// Cart and Wishlist Functions
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

// Image URL helper
const getImageUrl = (product) => {
  if (!product?.product_image?.[0]?.url) {
    return '/placeholder.jpg'
  }
  return product.product_image[0].url.replace(/\/+/g, '/')
}

// Fetch product data
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await new Promise((resolve) => setTimeout(resolve, 100))
  const productId = route.params.id
  if (productId) {
    const result = await store.getProductById(productId)
    if (result) {
      product.value = result
    }
  }
})
</script>
