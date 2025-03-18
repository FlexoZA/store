<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Users Management</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Add New User
      </button>
    </div>

    <!-- Placeholder for users table -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search users..."
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="customer">Customer</option>
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
          <p>Users management interface will be implemented in future updates.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowPathIcon, FunnelIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AdminUsers',
  components: {
    ArrowPathIcon,
    FunnelIcon,
  },
}
</script>
