<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/navigation/MainNavigation.vue'
import GeneralAlerts from '@/components/alerts/generalAlerts.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import AlertHandler from '@/components/alerts/AlertHandler.vue'
import MainFooter from './components/navigation/MainFooter.vue'

const alerts = ref(null)
const authStore = useAuthStore()

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
  <div class="bg-slate-100 min-h-screen">
    <Navigation />
    <RouterView />
    <GeneralAlerts ref="alerts" />
    <AlertHandler />
    <MainFooter />
  </div>
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
