<template>
  <div class="bg-slate-100">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Products</h2>

      <!-- Featured Product -->
      <div class="mb-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
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
              <h3 class="text-2xl font-bold text-gray-900">Lister</h3>
              <!-- Description -->
              <p class="mt-4 text-lg text-gray-500">
                The CWE3D Lister is a 3D printer engineered for reliability, precision, and ease of
                maintenance. Designed primarily for the South African market, it offers a balanced
                solution for enthusiasts, businesses, and educational institutions seeking a
                dependable and high-quality 3D printing experience.
              </p>
              <ul class="mt-4 space-y-2 text-gray-600 list-disc pl-5">
                <li>CoreXY design with a 250mm x 250mm x 240mm build volume</li>
                <li>Dual ballscrew Z-axis for superior stability and precision</li>
                <li>Sensorless homing on all axes for simplified mechanics</li>
                <li>Custom-designed super flat bed Garolite F4 base (low thermal warp)</li>
                <li>Open-source design with a focus on maintainability and upgradability</li>
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
              <p class="mt-6 text-l font-bold text-gray-900 text-right">R34,000</p>
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

      <!-- Products -->
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else>
        <div
          class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          <div v-for="item in items" :key="item.id" class="group">
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
              <h3 class="mt-4 text-sm text-gray-700">{{ item.name }}</h3>
              <p class="mt-1 text-lg font-medium text-gray-900">R{{ item.price.toFixed(2) }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalesBinderStore } from '@/stores/salesbinder/salesBinder'

const store = useSalesBinderStore()
const { items, loading, error } = storeToRefs(store)

onMounted(async () => {
  await store.fetchItems()
  console.log('DEBUG::', items.value) // Debug output
})
</script>

<style scoped></style>
