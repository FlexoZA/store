<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Mobile menu button -->
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
    >
      <Bars3Icon v-if="!isSidebarOpen" class="h-6 w-6" />
      <XMarkIcon v-else class="h-6 w-6" />
    </button>

    <!-- Navigation -->
    <AdminNavigation :is-sidebar-open="isSidebarOpen" />

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <!-- Top Navigation Bar -->
      <div class="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
            <BellIcon class="h-6 w-6" />
          </button>
          <div class="relative">
            <button
              class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none"
            >
              <span class="ml-2 hidden sm:inline">Admin User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/vue/24/outline'
import AdminNavigation from '@/components/admin/navigation/AdminNavigation.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminNavigation,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
  },
  setup() {
    const isSidebarOpen = ref(false)
    return {
      isSidebarOpen,
    }
  },
}
</script>
