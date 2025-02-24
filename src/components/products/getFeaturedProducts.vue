<template>
  <div v-if="currentPage === 1">
    <!-- Only show on page 1 -->
    <!-- Featured Product -->
    <div class="mt-12" v-if="loading">
      <ProductSkeleton />
    </div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else class="mb-12">
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
              <HeartIcon class="h-6 w-6" />
            </button>
            <button class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <ShoppingCartIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <hr class="mt-12 bg-gray-300 h-0.5 border-none" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeaturedProductsStore } from '@/stores/supabase/featuredProductsStore'
import { useProductsStore } from '@/stores/supabase/productsStore'
import ProductSkeleton from '@/components/loaders/featuredProductSkeleton.vue'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'

const featuredStore = useFeaturedProductsStore()
// Get products store for page number
const productsStore = useProductsStore()

const { featured_products, loading, error } = storeToRefs(featuredStore)
const { currentPage } = storeToRefs(productsStore)

onMounted(async () => {
  if (currentPage.value === 1) {
    // Only fetch if on page 1
    await featuredStore.getFeaturedProducts()
  }
})
</script>
