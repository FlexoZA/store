<template>
  <GeneralAlerts ref="alertsRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GeneralAlerts from './generalAlerts.vue'

const alertsRef = ref(null)

const handleShowAlert = (event) => {
  const { message, type, timeout } = event.detail
  alertsRef.value?.addAlert(message, type, timeout)
}

onMounted(() => {
  window.addEventListener('show-alert', handleShowAlert)
})

onUnmounted(() => {
  window.removeEventListener('show-alert', handleShowAlert)
})
</script>
