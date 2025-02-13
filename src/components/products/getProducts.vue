<template>
  <!-- Products -->
  <div class="mt-12" v-if="loading">
    <ProductSkeleton />
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <!-- Refresh button Todo::remove from production -->
    <button
      @click="refreshProducts"
      class="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
    >
      Refresh Products
    </button>

    <div
      class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      <div v-for="product in products" :key="product.id" class="group">
        <a href="#">
          <!--
                <img
                  :src="item.image || '@/assets/products/alt/C_trunking.jpg'"
                  :alt="item.name"
                  class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                -->
          <img
            src="@/assets/products/alt/C_trunking.jpg"
            alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
            class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
          />
          <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
          <p class="mt-1 text-lg font-medium text-gray-900">R{{ product.price.toFixed(2) }}</p>
        </a>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">{{ currentPage }}</span> of
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <!-- Previous button -->
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
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

            <!-- Page numbers -->
            <template v-for="page in totalPages" :key="page">
              <button
                @click="handlePageChange(page)"
                type="button"
                :class="[
                  'px-4 py-2 text-sm font-semibold focus:outline-none cursor-pointer',
                  page === currentPage ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600',
                ]"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next button -->
            <button
              type="text"
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/supabase/productsStore'
import ProductSkeleton from '@/components/loaders/productSkeleton.vue'

const store = useProductsStore()
const { products, loading, error, currentPage, totalPages } = storeToRefs(store)

const handlePageChange = async (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    await store.getProducts(newPage)
    // Add a small delay before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 0)
  }
}

// Add refresh function
const refreshProducts = async () => {
  store.clearProductsCache() // Clear the cache first Todo::remove from production
  await store.getProducts(currentPage.value) // Fetch fresh data for current page
}

onMounted(async () => {
  await store.getProducts()
})
</script>
