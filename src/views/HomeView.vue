<script setup>
import Products from '../components/products/getProducts.vue'
import FeaturedProduct from '../components/products/getFeaturedProducts.vue'
</script>

<template>
  <main>
    <div class="bg-slate-100">
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <FeaturedProduct />
        <Products />
      </div>
    </div>
  </main>
</template>
