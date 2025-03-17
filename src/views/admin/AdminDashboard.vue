<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 border-r border-gray-200 bg-white">
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
      </div>
      <nav class="mt-4">
        <ul>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-l-4 border-blue-500">
            <a href="#" class="flex items-center text-gray-700">
              <span class="mr-2">
                <HomeIcon class="h-5 w-5" />
              </span>
              Dashboard
            </a>
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <a href="#" class="flex items-center text-gray-700">
              <span class="mr-2">
                <ShoppingBagIcon class="h-5 w-5" />
              </span>
              Products
            </a>
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <a href="#" class="flex items-center text-gray-700">
              <span class="mr-2">
                <ClipboardDocumentListIcon class="h-5 w-5" />
              </span>
              Orders
            </a>
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <a href="#" class="flex items-center text-gray-700">
              <span class="mr-2">
                <UsersIcon class="h-5 w-5" />
              </span>
              Users
            </a>
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <a href="#" class="flex items-center text-gray-700">
              <span class="mr-2">
                <Cog6ToothIcon class="h-5 w-5" />
              </span>
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>

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
              <img
                class="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
              <span class="ml-2">Admin User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Stats Card 1 -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <h3 class="text-gray-500 text-sm">Total Sales</h3>
                <p class="text-2xl font-bold">R24,780</p>
              </div>
              <div class="bg-blue-100 p-2 rounded-md">
                <CurrencyDollarIcon class="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div class="mt-2">
              <span class="text-green-500 text-sm font-semibold">+8.2%</span>
              <span class="text-gray-500 text-sm"> from last month</span>
            </div>
          </div>

          <!-- Stats Card 2 -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <h3 class="text-gray-500 text-sm">New Orders</h3>
                <p class="text-2xl font-bold">45</p>
              </div>
              <div class="bg-orange-100 p-2 rounded-md">
                <ShoppingCartIcon class="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div class="mt-2">
              <span class="text-green-500 text-sm font-semibold">+12.4%</span>
              <span class="text-gray-500 text-sm"> from last week</span>
            </div>
          </div>

          <!-- Stats Card 3 -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <h3 class="text-gray-500 text-sm">Total Products</h3>
                <p class="text-2xl font-bold">128</p>
              </div>
              <div class="bg-green-100 p-2 rounded-md">
                <ArchiveBoxIcon class="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div class="mt-2">
              <span class="text-green-500 text-sm font-semibold">+3 new</span>
              <span class="text-gray-500 text-sm"> products added</span>
            </div>
          </div>

          <!-- Stats Card 4 -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <h3 class="text-gray-500 text-sm">Active Users</h3>
                <p class="text-2xl font-bold">320</p>
              </div>
              <div class="bg-purple-100 p-2 rounded-md">
                <UserGroupIcon class="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div class="mt-2">
              <span class="text-green-500 text-sm font-semibold">+14%</span>
              <span class="text-gray-500 text-sm"> from last month</span>
            </div>
          </div>
        </div>

        <!-- Placeholder for future content -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
          <p class="text-gray-500">Dashboard content will be implemented in future updates.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'AdminDashboard',
  components: {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    Cog6ToothIcon,
    BellIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
  },
  setup() {
    // Future functionality will be implemented here
    return {}
  },
}
</script>
