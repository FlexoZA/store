<template>
  <div
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
    </div>
    <nav class="mt-4">
      <ul>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-l-4 border-blue-500">
          <router-link to="/admin" class="flex items-center text-gray-700">
            <span class="mr-2">
              <HomeIcon class="h-5 w-5" />
            </span>
            Dashboard
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <router-link to="/admin/products" class="flex items-center text-gray-700">
            <span class="mr-2">
              <ShoppingBagIcon class="h-5 w-5" />
            </span>
            Products
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <router-link to="/admin/orders" class="flex items-center text-gray-700">
            <span class="mr-2">
              <ClipboardDocumentListIcon class="h-5 w-5" />
            </span>
            Orders
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <router-link to="/admin/users" class="flex items-center text-gray-700">
            <span class="mr-2">
              <UsersIcon class="h-5 w-5" />
            </span>
            Users
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <router-link to="/admin/settings" class="flex items-center text-gray-700">
            <span class="mr-2">
              <Cog6ToothIcon class="h-5 w-5" />
            </span>
            Settings
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'AdminNavigation',
  components: {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    Cog6ToothIcon,
  },
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
