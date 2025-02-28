<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-4">
      <div v-if="!showRegistration" class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Login Required</h1>
        <p class="text-gray-600 mt-2">Please log in to continue to checkout</p>
      </div>

      <!-- Login dialog used as a page component -->
      <UserLoginDialog
        :isOpen="!showRegistration"
        @close="handleLoginClose"
        @open-registration="showRegistration = true"
      />

      <!-- Registration dialog -->
      <UserRegistrationDialog
        :show="showRegistration"
        @close="handleRegistrationClose"
        @open-login="showRegistration = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import UserLoginDialog from '@/components/authentication/UserLoginDialog.vue'
import UserRegistrationDialog from '@/components/authentication/UserRegistrationDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showRegistration = ref(false)

// Check if user is already authenticated
onMounted(() => {
  if (authStore.getCurrentUser()) {
    // If already logged in, redirect
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  }
})

// Handle login dialog close
const handleLoginClose = () => {
  if (authStore.getCurrentUser()) {
    // If logged in after dialog closes, redirect
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } else {
    // If cancelled, go back to previous page
    router.back()
  }
}

// Handle registration dialog close
const handleRegistrationClose = () => {
  if (authStore.getCurrentUser()) {
    // If registered and logged in, redirect
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } else {
    // Return to login if registration was cancelled
    showRegistration.value = false
  }
}
</script>
