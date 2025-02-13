<template>
  <!-- Featured Product -->
  <div class="mt-12" v-if="loading">
    <ProductSkeleton />
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else class="mb-12">
    <!-- Add this button if you want manual refresh capability Todo::remove from production -->
    <button
      @click="refreshProducts"
      class="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
    >
      Refresh Products
    </button>
    <div
      v-for="product in featured_products"
      :key="product.id"
      class="grid grid-cols-1 gap-8 md:grid-cols-2"
    >
      <!-- Image -->
      <div class="aspect-square overflow-hidden rounded-lg">
        <img
          src="@/assets/products/lister.png"
          alt="Featured product"
          class="h-full w-full object-cover"
        />
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-between">
        <div>
          <!-- Title -->
          <h3 class="text-2xl font-bold text-gray-900">{{ product.name }}</h3>
          <!-- Description -->
          <p class="mt-4 text-lg text-gray-500">
            {{ product.description }}
          </p>
          <!-- Specifications -->
          <ul class="mt-4 space-y-2 text-gray-600 list-disc pl-5">
            <li v-for="spec in product.featured_product_specification" :key="spec.id">
              {{ spec.specification }}
            </li>
          </ul>

          <!-- Action Buttons -->
          <div class="mt-4">
            <a
              :href="product.read_more_url"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block mr-4"
            >
              Read More
            </a>
            <a
              :href="product.documentation_url"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block mr-4"
            >
              Documentation
            </a>
            <a
              :href="product.view_3d_url"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 inline-block"
            >
              3D View
            </a>
          </div>
          <hr class="mt-12 bg-gray-300 h-0.5 border-none" />
          <p class="mt-6 text-l font-bold text-gray-900 text-right">
            R{{ product.price.toFixed(2) }}
          </p>
        </div>

        <!-- Icons -->
        <div class="mt-6 flex justify-end gap-4">
          <button class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
          <button class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <hr class="mt-12 bg-gray-300 h-0.5 border-none" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSupabaseStore } from '@/stores/supabase/Supabase'
import ProductSkeleton from '@/components/loaders/featuredProductSkeleton.vue'

const store = useSupabaseStore()
const { featured_products, loading, error } = storeToRefs(store)

// Add this function to force a refresh Todo::remove from production
const refreshProducts = async () => {
  store.clearFeaturedProductsCache() // Clear the cache first
  await store.getFeaturedProducts() // Then fetch fresh data
}

onMounted(async () => {
  await store.getFeaturedProducts()
})
</script>
