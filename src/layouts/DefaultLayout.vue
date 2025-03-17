<template>
  <div class="default-layout">
    <!-- Main Navigation -->
    <MainNavigation />

    <!-- Main Content -->
    <main>
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="mb-6 md:mb-0">
            <h3 class="text-lg font-semibold mb-4">Store</h3>
            <p>Your one-stop shop for quality products.</p>
          </div>
          <div class="mb-6 md:mb-0">
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li class="mb-2"><a href="/" class="hover:text-blue-300">Home</a></li>
              <li class="mb-2"><a href="#" class="hover:text-blue-300">Products</a></li>
              <li class="mb-2"><a href="#" class="hover:text-blue-300">About Us</a></li>
              <li class="mb-2"><a href="#" class="hover:text-blue-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <p class="mb-2">123 Store Street</p>
            <p class="mb-2">Cape Town, South Africa</p>
            <p class="mb-2">Email: info@store.com</p>
            <p>Phone: +27 21 123 4567</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {{ new Date().getFullYear() }} Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import MainNavigation from '../components/navigation/MainNavigation.vue'

export default {
  name: 'DefaultLayout',
  components: {
    MainNavigation,
  },
}
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
