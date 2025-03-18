<template>
  <div class="p-4 sm:p-6">
    <StatsOverview />

    <!-- Placeholder for future content -->
    <div class="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
      <p class="text-gray-500">Dashboard content will be implemented in future updates.</p>
    </div>
  </div>
</template>

<script>
import StatsOverview from './StatsOverview.vue'

export default {
  name: 'DashboardOverview',
  components: {
    StatsOverview,
  },
}
</script>
