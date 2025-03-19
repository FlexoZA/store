<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Products Management</h1>
      <button
        @click="showAddProductModal = true"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add New Product
      </button>
    </div>

    <!-- Search and filters -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="handleSearch"
            />
            <select
              v-model="selectedCategory"
              @change="handleCategoryFilter"
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in productStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.category_name }}
              </option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="refreshProducts"
              class="p-2 text-gray-500 hover:text-gray-700"
              :class="{ 'animate-spin': productStore.isLoading }"
            >
              <ArrowPathIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Products table -->
      <div class="overflow-x-auto">
        <AdminProductSkeleton v-if="productStore.isLoading" />
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="productStore.isLoading">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading products...</td>
            </tr>
            <tr v-else-if="productStore.products.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                No products found. Try adjusting your search or add a new product.
              </td>
            </tr>
            <tr
              v-else
              v-for="product in productStore.products"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-md object-cover" :src="getImageUrl(product)" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.product_name }}</div>
                    <div class="text-sm text-gray-500">SKU: {{ product.sku || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">R{{ product.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.quantity }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getCategoryName(product.category_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                >
                  {{ product.quantity > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="promptDeleteProduct(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="productStore.totalProducts > 0 && !searchQuery.trim()"
        class="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6"
      >
        <!-- Mobile Pagination -->
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="handlePageChange(productStore.currentPage - 1)"
            :disabled="!productStore.hasPreviousPage"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': !productStore.hasPreviousPage }"
          >
            Previous
          </button>
          <button
            @click="handlePageChange(productStore.currentPage + 1)"
            :disabled="!productStore.hasNextPage"
            class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': !productStore.hasNextPage }"
          >
            Next
          </button>
        </div>

        <!-- Desktop Pagination -->
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <!-- Page Information -->
          <div>
            <p class="text-sm text-gray-700">
              Showing page <span class="font-medium">{{ productStore.currentPage }}</span> of
              <span class="font-medium">{{ productStore.totalPages }}</span>
            </p>
          </div>

          <!-- Pagination Navigation -->
          <div>
            <nav class="isolate inline-flex -space-x-px" aria-label="Pagination">
              <!-- Previous Page Button -->
              <button
                @click="handlePageChange(productStore.currentPage - 1)"
                :disabled="!productStore.hasPreviousPage"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': !productStore.hasPreviousPage }"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <!-- Page Numbers -->
              <template v-for="page in productStore.totalPages" :key="page">
                <button
                  @click="handlePageChange(page)"
                  type="button"
                  :class="[
                    'px-4 py-2 text-sm font-semibold focus:outline-none cursor-pointer',
                    page === productStore.currentPage
                      ? 'text-black'
                      : 'text-gray-500 hover:text-black',
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Next Page Button -->
              <button
                type="text"
                @click="handlePageChange(productStore.currentPage + 1)"
                :disabled="!productStore.hasNextPage"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': !productStore.hasNextPage }"
              >
                <span class="sr-only">Next</span>
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Add product modal placeholder -->
    <!-- Delete confirmation modal placeholder -->
    <!-- Edit product modal -->
    <UpdateProduct
      v-if="showEditModal"
      :show="showEditModal"
      :product="currentProduct"
      @close="showEditModal = false"
      @updated="handleProductUpdated"
    />
  </div>
</template>

<script>
import {
  ArrowPathIcon,
  ArrowLeftIcon as ChevronLeftIcon,
  ArrowRightIcon as ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { useAdminProductStore } from '@/stores/admin/adminProductStore'
import AdminProductSkeleton from '@/components/loaders/AdminProductSkeleton.vue'
import UpdateProduct from './UpdateProduct.vue'

export default {
  name: 'AdminProducts',
  components: {
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    AdminProductSkeleton,
    UpdateProduct,
  },
  setup() {
    const productStore = useAdminProductStore()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const showAddProductModal = ref(false)
    const showDeleteModal = ref(false)
    const showEditModal = ref(false)
    const currentProduct = ref(null)

    // Helper function to get image URL
    const getImageUrl = (product) => {
      if (product.product_image && product.product_image.length > 0) {
        const defaultImage =
          product.product_image.find((img) => img.is_default) || product.product_image[0]
        return defaultImage.url
      }
      return '/placeholder.jpg'
    }

    onMounted(async () => {
      await Promise.all([productStore.fetchProducts(), productStore.getCategories()])
    })

    const refreshProducts = async () => {
      window.scrollTo({ top: 0 })
      if (searchQuery.value.trim()) {
        await productStore.searchProducts(searchQuery.value, 1)
      } else if (selectedCategory.value) {
        await productStore.filterProductsByCategory(selectedCategory.value, 1)
      } else {
        await productStore.fetchProducts(1)
      }
    }

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        productStore.debouncedSearch(searchQuery.value)
      } else {
        productStore.fetchProducts(1)
      }
      // Clear category filter when searching
      selectedCategory.value = ''
    }

    const handleCategoryFilter = () => {
      // Convert to number if it's a non-empty string that can be converted to a number
      const categoryId =
        selectedCategory.value !== ''
          ? isNaN(Number(selectedCategory.value))
            ? selectedCategory.value
            : Number(selectedCategory.value)
          : null

      productStore.filterProductsByCategory(categoryId, 1)
      // Clear search when filtering by category
      searchQuery.value = ''
    }

    const getCategoryName = (categoryId) => {
      if (!categoryId) return 'Uncategorized'

      const category = productStore.categories.find((c) => c.id === categoryId)
      return category ? category.category_name : 'Uncategorized'
    }

    const editProduct = (product) => {
      currentProduct.value = { ...product }
      showEditModal.value = true
    }

    const promptDeleteProduct = (product) => {
      currentProduct.value = product
      showDeleteModal.value = true
    }

    const handlePageChange = (page) => {
      // Only proceed if page is valid
      if (page >= 1 && page <= productStore.totalPages) {
        window.scrollTo({ top: 0 })

        // Determine which action to perform based on current state
        if (productStore.currentAction === 'search' && searchQuery.value.trim()) {
          productStore.searchProducts(searchQuery.value, page)
        } else if (productStore.currentAction === 'filter' && selectedCategory.value) {
          productStore.filterProductsByCategory(selectedCategory.value, page)
        } else {
          productStore.fetchProducts(page)
        }
      }
    }

    const handleProductUpdated = async () => {
      await refreshProducts()
    }

    return {
      productStore,
      searchQuery,
      selectedCategory,
      showAddProductModal,
      showDeleteModal,
      showEditModal,
      currentProduct,
      refreshProducts,
      handleSearch,
      handleCategoryFilter,
      getCategoryName,
      editProduct,
      promptDeleteProduct,
      handlePageChange,
      handleProductUpdated,
      getImageUrl,
    }
  },
}
</script>
