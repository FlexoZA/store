<template>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <!-- Image Skeleton -->
    <div class="aspect-square overflow-hidden rounded-lg bg-gray-200 animate-shimmer"></div>

    <!-- Product Info Skeleton -->
    <div class="flex flex-col justify-between">
      <div>
        <!-- Title Skeleton -->
        <div class="h-8 bg-gray-200 rounded w-3/4 animate-shimmer"></div>

        <!-- Description Skeleton -->
        <div class="mt-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6 animate-shimmer"></div>
        </div>

        <!-- Specifications Skeleton -->
        <div class="mt-4 space-y-2 pl-5">
          <div class="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5 animate-shimmer"></div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="mt-4 flex gap-4">
          <div class="h-4 bg-gray-200 rounded w-20 animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-24 animate-shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-16 animate-shimmer"></div>
        </div>

        <hr class="mt-12 bg-gray-300 h-0.5 border-none" />

        <!-- Price Skeleton -->
        <div class="mt-6 flex justify-end">
          <div class="h-6 bg-gray-200 rounded w-24 animate-shimmer"></div>
        </div>
      </div>

      <!-- Icons Skeleton -->
      <div class="mt-6 flex justify-end gap-4">
        <div class="rounded-full p-2 bg-gray-200 h-10 w-10 animate-shimmer"></div>
        <div class="rounded-full p-2 bg-gray-200 h-10 w-10 animate-shimmer"></div>
      </div>
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
