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
              @keyup.enter="handleSearch"
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
            <button
              @click="testFetchCategories"
              class="p-2 text-gray-500 hover:text-gray-700"
              title="Test fetch categories"
            >
              <FunnelIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Products table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
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
                    <img
                      class="h-10 w-10 rounded-md object-cover"
                      src="https://via.placeholder.com/150"
                    />
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
        v-if="productStore.totalProducts > 0"
        class="px-6 py-4 bg-white border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ getPaginationRange().start }}</span>
            to
            <span class="font-medium">{{ getPaginationRange().end }}</span>
            of
            <span class="font-medium">{{ productStore.totalProducts }}</span>
            products
          </div>
          <div class="flex justify-end items-center space-x-2">
            <button
              @click="productStore.previousPage"
              :disabled="!productStore.hasPreviousPage"
              class="px-3 py-1 border rounded-md text-sm font-medium"
              :class="
                productStore.hasPreviousPage
                  ? 'text-blue-500 hover:bg-blue-50'
                  : 'text-gray-300 cursor-not-allowed'
              "
            >
              Previous
            </button>

            <div v-if="productStore.totalPages <= 7" class="hidden sm:flex space-x-1">
              <button
                v-for="page in productStore.totalPages"
                :key="page"
                @click="productStore.goToPage(page)"
                class="px-3 py-1 border rounded-md text-sm font-medium"
                :class="
                  page === productStore.currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-50'
                "
              >
                {{ page }}
              </button>
            </div>

            <div v-else class="hidden sm:flex space-x-1">
              <!-- First page -->
              <button
                @click="productStore.goToPage(1)"
                class="px-3 py-1 border rounded-md text-sm font-medium"
                :class="
                  1 === productStore.currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-50'
                "
              >
                1
              </button>

              <!-- Ellipsis if needed -->
              <span v-if="getPaginationArray()[0] > 2" class="px-2 py-1 text-gray-500">...</span>

              <!-- Middle pages -->
              <button
                v-for="page in getPaginationArray()"
                :key="page"
                @click="productStore.goToPage(page)"
                class="px-3 py-1 border rounded-md text-sm font-medium"
                :class="
                  page === productStore.currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-50'
                "
              >
                {{ page }}
              </button>

              <!-- Ellipsis if needed -->
              <span
                v-if="
                  getPaginationArray()[getPaginationArray().length - 1] <
                  productStore.totalPages - 1
                "
                class="px-2 py-1 text-gray-500"
              >
                ...
              </span>

              <!-- Last page if not already included -->
              <button
                v-if="
                  getPaginationArray()[getPaginationArray().length - 1] !== productStore.totalPages
                "
                @click="productStore.goToPage(productStore.totalPages)"
                class="px-3 py-1 border rounded-md text-sm font-medium"
                :class="
                  productStore.totalPages === productStore.currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-50'
                "
              >
                {{ productStore.totalPages }}
              </button>
            </div>

            <button
              @click="productStore.nextPage"
              :disabled="!productStore.hasNextPage"
              class="px-3 py-1 border rounded-md text-sm font-medium"
              :class="
                productStore.hasNextPage
                  ? 'text-blue-500 hover:bg-blue-50'
                  : 'text-gray-300 cursor-not-allowed'
              "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add product modal placeholder -->
    <!-- Delete confirmation modal placeholder -->
    <!-- Edit product modal placeholder -->
  </div>
</template>

<script>
import { ArrowPathIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { useAdminProductStore } from '@/stores/admin/adminProductStore'

export default {
  name: 'AdminProducts',
  components: {
    ArrowPathIcon,
    FunnelIcon,
  },
  setup() {
    const productStore = useAdminProductStore()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const showAddProductModal = ref(false)
    const showDeleteModal = ref(false)
    const showEditModal = ref(false)
    const currentProduct = ref(null)

    onMounted(async () => {
      await Promise.all([productStore.fetchProducts(), productStore.fetchCategories()])
    })

    const refreshProducts = async () => {
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
        productStore.searchProducts(searchQuery.value, 1)
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

    // Helper function to get the pagination range for display
    const getPaginationRange = () => {
      if (!productStore.totalProducts || productStore.totalProducts === 0) {
        return { start: 0, end: 0 }
      }

      const start =
        productStore.products.length > 0
          ? (productStore.currentPage - 1) * productStore.pageSize + 1
          : 0

      const end = Math.min(start + productStore.products.length - 1, productStore.totalProducts)

      return { start, end }
    }

    // Helper function to get the pagination array for display
    const getPaginationArray = () => {
      const totalPages = productStore.totalPages || 0
      const currentPage = productStore.currentPage || 1

      // If no pages or only one page, return empty array
      if (totalPages <= 1) {
        return []
      }

      // Show 5 page numbers centered around current page
      let startPage = Math.max(currentPage - 2, 2)
      let endPage = Math.min(startPage + 4, totalPages - 1)

      // Adjust if we're near the end
      if (endPage >= totalPages - 1) {
        endPage = totalPages - 1
        startPage = Math.max(endPage - 4, 2)
      }

      // Adjust if we're near the beginning
      if (startPage <= 2) {
        startPage = 2
        endPage = Math.min(startPage + 4, totalPages - 1)
      }

      // Create array of page numbers to display
      const pages = []
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    }

    const testFetchCategories = async () => {
      console.log('Reloading hardcoded categories')
      try {
        await productStore.fetchCategories()
        alert(`Successfully loaded ${productStore.categories.length} hardcoded categories`)
      } catch (e) {
        console.error('Error loading categories:', e)
        alert('Error loading categories: ' + e.message)
      }
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
      getPaginationRange,
      getPaginationArray,
      testFetchCategories,
    }
  },
}
</script>
