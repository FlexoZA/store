<template>
  <div class="relative w-full max-w-md" ref="searchBarRef">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      v-model="searchQuery"
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      :placeholder="placeholder"
      @focus="showSearchResults = true"
      @blur="setTimeout(() => (showSearchResults = false), 200)"
    />

    <!-- Search Results Dropdown -->
    <div
      v-if="showSearchResults && searchQuery.trim()"
      class="absolute mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div v-if="searchLoading" class="p-4 text-center text-gray-500">Searching...</div>
      <div v-else-if="searchResults.length === 0" class="p-4 text-center text-gray-500">
        No products found
      </div>
      <div v-else class="max-h-96 overflow-y-auto">
        <div
          v-for="product in searchResults"
          :key="product.id"
          class="p-2 hover:bg-gray-50 cursor-pointer flex items-start gap-3 relative"
          @click="handleProductClick(product)"
        >
          <div class="relative w-12 h-12">
            <img
              :src="getImageUrl(product)"
              :alt="product.name"
              class="w-12 h-12 object-cover rounded transition-opacity duration-300"
              :class="{
                'opacity-0':
                  !imageLoaded[product.id] && getImageUrl(product) !== '/placeholder.jpg',
              }"
              @load="handleImageLoad(product.id)"
              @error="handleImageError(product.id)"
            />
            <div
              v-if="!imageLoaded[product.id]"
              class="absolute inset-0 bg-gray-100 rounded animate-pulse"
            ></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</div>
            <div class="text-sm text-gray-500">R{{ product.price.toFixed(2) }}</div>
          </div>
          <button
            class="absolute bottom-2 right-2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-pointer transition-all"
            :class="{
              'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400':
                product.quantity <= 0,
              'text-gray-400': isInCart(product.id),
            }"
            @click.stop="handleCartAction(product)"
            :disabled="product.quantity <= 0"
            :title="product.quantity <= 0 ? 'Out of stock' : ''"
          >
            <ShoppingCartIcon :class="{ 'fill-current': isInCart(product.id) }" class="w-4 h-4" />
          </button>
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
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/supabase/searchStore'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useShoppingCartStore } from '@/stores/supabase/shoppingCartStore'
import AddToCartModal from '@/components/modals/AddToCartModal.vue'

defineProps({
  placeholder: {
    type: String,
    default: 'Search products...',
  },
})

const router = useRouter()
const searchStore = useSearchStore()
const cartStore = useShoppingCartStore()
const { searchResults, searchLoading } = storeToRefs(searchStore)
const { isInCart } = cartStore

const searchQuery = ref('')
const showSearchResults = ref(false)
const imageLoaded = ref({})
const showAddToCartModal = ref(false)
const selectedProduct = ref(null)
const searchBarRef = ref(null)

// Helper function to get image URL
const getImageUrl = (product) => {
  return product.product_image && product.product_image[0]
    ? product.product_image[0].url
    : '/placeholder.jpg'
}

// Image handling functions
const handleImageLoad = (productId) => {
  imageLoaded.value[productId] = true
}

const handleImageError = (productId) => {
  imageLoaded.value[productId] = true
}

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Debounced search
const debouncedSearch = debounce((query) => {
  searchStore.searchProducts(query)
}, 300)

// Watch search query
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    debouncedSearch(newQuery)
    showSearchResults.value = true
  } else {
    showSearchResults.value = false
  }
})

const handleProductClick = (product) => {
  router.push(`/product/${product.id}`)
  showSearchResults.value = false
  searchQuery.value = ''
}

const handleCartAction = (product) => {
  selectedProduct.value = product
  showAddToCartModal.value = true
}

const handleAddToCart = (productWithQuantity) => {
  cartStore.addToCart(productWithQuantity)
  showAddToCartModal.value = false
}

// Click outside handler
const handleClickOutside = (event) => {
  if (searchBarRef.value && !searchBarRef.value.contains(event.target)) {
    showSearchResults.value = false
  }
}

// Setup and cleanup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
