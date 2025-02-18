<template>
  <div
    v-if="alerts.length > 0"
    class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full"
  >
    <div
      v-for="alert in alerts"
      :key="alert.id"
      class="transform transition-all duration-300 ease-in-out"
      :class="alert.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
    >
      <div
        class="rounded-lg p-4 flex items-center justify-between shadow-lg backdrop-blur-sm"
        :class="getAlertClass(alert.type)"
      >
        <div class="flex items-center">
          <!-- Success Icon -->
          <svg
            v-if="alert.type === 'success'"
            class="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>

          <!-- Error Icon -->
          <svg
            v-if="alert.type === 'error'"
            class="h-5 w-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="text-sm font-medium">{{ alert.message }}</span>
        </div>

        <!-- Dismiss Button -->
        <button
          @click="dismissAlert(alert.id)"
          class="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alerts = ref([])
let nextId = 0

const getAlertClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800'
    case 'error':
      return 'bg-red-50 text-red-800'
    default:
      return 'bg-blue-50 text-blue-800'
  }
}

const addAlert = (message, type = 'success', timeout = 3000) => {
  const id = nextId++
  const alert = {
    id,
    message,
    type,
    show: true,
  }
  alerts.value.push(alert)

  // Start hide animation after timeout
  setTimeout(() => {
    const alertToHide = alerts.value.find((a) => a.id === id)
    if (alertToHide) {
      alertToHide.show = false
    }
  }, timeout - 300) // Start animation 300ms before removal

  // Remove alert after timeout
  setTimeout(() => {
    dismissAlert(id)
  }, timeout)
}

const dismissAlert = (id) => {
  const index = alerts.value.findIndex((alert) => alert.id === id)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
}

// Expose methods for external use
defineExpose({
  addAlert,
})
</script>
