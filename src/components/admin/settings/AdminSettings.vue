<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Settings</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Save Changes
      </button>
    </div>

    <!-- Settings sections -->
    <div class="space-y-6">
      <!-- Store Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Store Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter store name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Store Description</label>
            <textarea
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="Enter store description"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter contact email"
            />
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Payment Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Currency</label>
            <select
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ZAR">South African Rand (ZAR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Methods</label>
            <div class="mt-2 space-y-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span class="ml-2">Credit Card</span>
              </label>
              <label class="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span class="ml-2">PayPal</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping Settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Shipping Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Default Shipping Cost</label>
            <input
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter default shipping cost"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Free Shipping Threshold</label>
            <input
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter free shipping threshold"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
}
</script>
