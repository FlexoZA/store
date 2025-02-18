<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/navigation/Navigation.vue'
import GeneralAlerts from '@/components/alerts/generalAlerts.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const alerts = ref(null)

const handleShowAlert = (event) => {
  const { message, type, timeout } = event.detail
  alerts.value?.addAlert(message, type, timeout)
}

onMounted(() => {
  window.addEventListener('show-alert', handleShowAlert)
})

onUnmounted(() => {
  window.removeEventListener('show-alert', handleShowAlert)
})
</script>

<template>
  <div class="bg-slate-100">
    <Navigation />
    <!--
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
-->

    <RouterView />
    <GeneralAlerts ref="alerts" />
  </div>
</template>
