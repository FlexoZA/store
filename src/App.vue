<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import GeneralAlerts from '@/components/alerts/generalAlerts.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import AlertHandler from '@/components/alerts/AlertHandler.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'

const alerts = ref(null)
const authStore = useAuthStore()
const route = useRoute()

// Map of layout names to components
const layouts = {
  DefaultLayout,
  AdminLayout,
}

// Determine which layout to use based on the route's meta.layout property
const layout = computed(() => {
  // Get the layout from the route meta, default to 'default' if not specified
  const layoutName = route.meta.layout || 'default'
  // Get the component from the layouts map
  return layouts[`${layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}Layout`]
})

const handleShowAlert = (event) => {
  const { message, type, timeout } = event.detail
  alerts.value?.addAlert(message, type, timeout)
}

onMounted(() => {
  window.addEventListener('show-alert', handleShowAlert)
  authStore.initialize()
})

onUnmounted(() => {
  window.removeEventListener('show-alert', handleShowAlert)
})
</script>

<template>
  <component :is="layout">
    <div class="bg-slate-100 min-h-screen">
      <RouterView />
      <GeneralAlerts ref="alerts" />
      <AlertHandler />
    </div>
  </component>
</template>

<style>
/* Global cursor styles */
button,
[role='button'],
a,
.cursor-pointer {
  cursor: pointer;
}

/* Disabled state */
button:disabled,
[role='button']:disabled,
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
