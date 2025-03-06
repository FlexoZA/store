<template>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
  >
    <div v-for="n in 20" :key="n" class="group">
      <!-- Image skeleton -->
      <div class="aspect-square w-full rounded-lg bg-gray-200 xl:aspect-7/8 animate-shimmer"></div>

      <!-- Product name skeleton -->
      <div class="mt-4 h-4 w-3/4 rounded bg-gray-200 animate-shimmer"></div>

      <!-- Price skeleton -->
      <div class="mt-1 h-5 w-1/3 rounded bg-gray-200 animate-shimmer"></div>
    </div>
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
