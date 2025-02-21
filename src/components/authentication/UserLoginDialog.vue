<template>
  <!-- Main login modal container with background image -->
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <!-- Semi-transparent overlay for background blur -->
    <div class="absolute inset-0 backdrop-brightness-50 backdrop-blur-sm"></div>

    <!-- Login form card -->
    <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl relative" @click.stop>
      <div class="p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

        <!-- Login form with email and password inputs -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email input field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>
          </div>

          <!-- Password input field with show/hide toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                :class="{ 'border-red-500': passwordError }"
              />
              <!-- Toggle password visibility button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <!-- Show password icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: !showPassword }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <!-- Hide password icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: showPassword }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>
          </div>

          <!-- Error message display -->
          <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Form action buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeDialog"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading">Loading...</span>
              <span v-else>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import backgroundImage from '@/assets/ListerBG.jpg'
import { validateEmail, validatePassword } from '@/utils/validation'

// Props definition
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

// Initialize auth store and reactive variables
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Email validation using computed property
const emailError = computed(() => validateEmail(email.value))

// Password validation using computed property
const passwordError = computed(() => validatePassword(password.value))

// Define emits for parent component communication
const emit = defineEmits(['close'])

// Close dialog handler
const closeDialog = () => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
  showPassword.value = false
  emit('close')
}

// Watch for dialog closing from parent
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      email.value = ''
      password.value = ''
      errorMessage.value = ''
      showPassword.value = false
    }
  },
)

// Alert helper function to show notifications
const showAlert = (message, type = 'success', timeout = 3000) => {
  window.dispatchEvent(
    new CustomEvent('show-alert', {
      detail: { message, type, timeout },
    }),
  )
}

// Login form submission handler
const handleLogin = async () => {
  // Validate form before submission
  if (emailError.value || passwordError.value) {
    errorMessage.value = 'Please fix all validation errors before submitting'
    return
  }
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Attempt to sign in using auth store
    const { error } = await authStore.signIn(email.value, password.value)

    if (error) {
      errorMessage.value = error.message || 'Login failed. Please try again.'
      showAlert('Login failed', 'error')
      return
    }

    // Reset form and close dialog on successful login
    email.value = ''
    password.value = ''
    showAlert('Successfully logged in!', 'success')
    closeDialog()
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
    showAlert('Login failed', 'error')
  } finally {
    loading.value = false
  }
}
</script>
