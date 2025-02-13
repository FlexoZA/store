<template>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
    <!-- Image Skeleton -->
    <div class="aspect-square overflow-hidden rounded-lg bg-gray-200"></div>

    <!-- Product Info Skeleton -->
    <div class="flex flex-col justify-between">
      <div>
        <!-- Title Skeleton -->
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>

        <!-- Description Skeleton -->
        <div class="mt-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        <!-- Specifications Skeleton -->
        <div class="mt-4 space-y-2 pl-5">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="mt-4 flex gap-4">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        <hr class="mt-12 bg-gray-300 h-0.5 border-none" />

        <!-- Price Skeleton -->
        <div class="mt-6 flex justify-end">
          <div class="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <!-- Icons Skeleton -->
      <div class="mt-6 flex justify-end gap-4">
        <div class="rounded-full p-2 bg-gray-200 h-10 w-10"></div>
        <div class="rounded-full p-2 bg-gray-200 h-10 w-10"></div>
      </div>
    </div>
  </div>
</template>
