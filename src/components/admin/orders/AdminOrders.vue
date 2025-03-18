<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Orders Management</h1>
    </div>

    <!-- Placeholder for orders table -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search orders..."
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <ArrowPathIcon class="h-5 w-5" />
            </button>
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <FunnelIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Placeholder table -->
      <div class="p-4">
        <div class="text-center text-gray-500 py-8">
          <p>Orders management interface will be implemented in future updates.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowPathIcon, FunnelIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AdminOrders',
  components: {
    ArrowPathIcon,
    FunnelIcon,
  },
}
</script>
