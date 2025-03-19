<template>
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
        <tr v-for="n in 5" :key="n" class="hover:bg-gray-50">
          <!-- Product Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-md bg-gray-200 animate-shimmer"></div>
              </div>
              <div class="ml-4">
                <div class="h-4 w-32 bg-gray-200 rounded animate-shimmer"></div>
                <div class="h-3 w-24 bg-gray-200 rounded mt-1 animate-shimmer"></div>
              </div>
            </div>
          </td>
          <!-- Price Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 w-16 bg-gray-200 rounded animate-shimmer"></div>
          </td>
          <!-- Stock Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 w-12 bg-gray-200 rounded animate-shimmer"></div>
          </td>
          <!-- Category Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 w-24 bg-gray-200 rounded animate-shimmer"></div>
          </td>
          <!-- Status Column -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-5 w-20 bg-gray-200 rounded-full animate-shimmer"></div>
          </td>
          <!-- Actions Column -->
          <td class="px-6 py-4 whitespace-nowrap text-right">
            <div class="flex justify-end space-x-3">
              <div class="h-4 w-12 bg-gray-200 rounded animate-shimmer"></div>
              <div class="h-4 w-12 bg-gray-200 rounded animate-shimmer"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}
</style>
