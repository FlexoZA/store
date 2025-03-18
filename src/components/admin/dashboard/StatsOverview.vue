<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
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
</template>

<script>
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'StatsOverview',
  components: {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
  },
}
</script>
