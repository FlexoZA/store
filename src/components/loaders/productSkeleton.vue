<template>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
  >
    <div v-for="n in 20" :key="n" class="group animate-pulse">
      <!-- Image skeleton -->
      <div class="aspect-square w-full rounded-lg bg-gray-200 xl:aspect-7/8"></div>

      <!-- Product name skeleton -->
      <div class="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>

      <!-- Price skeleton -->
      <div class="mt-1 h-5 w-1/3 rounded bg-gray-200"></div>
    </div>
  </div>
</template>
