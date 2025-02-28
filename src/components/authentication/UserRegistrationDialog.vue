<template>
  <!-- Main registration modal container with background image -->
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <!-- Semi-transparent overlay with blur effect -->
    <div class="absolute inset-0 backdrop-brightness-50 backdrop-blur-sm"></div>

    <!-- Registration form card -->
    <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl relative" @click.stop>
      <div class="p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Create your account</h2>

        <!-- Registration form with user details -->
        <form @submit.prevent="handleRegistration" class="space-y-4">
          <!-- Email input field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>
          </div>

          <!-- Password input field with show/hide toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': passwordError }"
              />
              <!-- Password visibility toggle button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
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

          <!-- Confirm Password input field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                :class="{ 'border-red-500': confirmPasswordError }"
              />
            </div>
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-500">
              {{ confirmPasswordError }}
            </p>
          </div>

          <!-- Personal information fields -->
          <!-- Name input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Surname input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
            <input
              id="surname"
              v-model="formData.surname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Contact information fields -->
          <!-- Phone number input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              @input="handlePhoneInput"
              placeholder="+27 XX XXX XXXX"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              :class="{ 'border-red-500': phoneError }"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-500">{{ phoneError }}</p>
            <p class="mt-1 text-xs text-gray-500">Format: +27 XX XXX XXXX (South African number)</p>
          </div>

          <!-- Address textarea -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              id="address"
              v-model="formData.address"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Error message display -->
          <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded-md">
            {{ error }}
          </div>

          <!-- Form action buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Creating account...</span>
              <span v-else>Sign up</span>
            </button>
          </div>

          <!-- Login link -->
          <div class="text-right mt-4 text-sm text-gray-600">
            Already have an account?
            <a @click="openLogin" class="text-blue-500 hover:text-blue-700 cursor-pointer">
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/ListerBG.jpg'
import {
  validateEmail,
  validatePassword,
  validatePhone,
  formatPhoneNumber,
} from '@/utils/validation'

// Props definition
const { show } = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

// Initialize required composables and refs
const emit = defineEmits(['close', 'open-login'])
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Form data object with confirm password
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  surname: '',
  phone: '',
  address: '',
})

// Validation computed properties
const emailError = computed(() => validateEmail(formData.value.email))
const passwordError = computed(() => validatePassword(formData.value.password))

const confirmPasswordError = computed(() => {
  if (!formData.value.confirmPassword) return ''
  return formData.value.password === formData.value.confirmPassword ? '' : 'Passwords do not match'
})

const phoneError = computed(() => validatePhone(formData.value.phone))

const isFormValid = computed(() => {
  return (
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    !phoneError.value &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.name &&
    formData.value.surname &&
    formData.value.phone &&
    formData.value.address
  )
})

// Add a new function to reset the form
const resetForm = () => {
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    phone: '',
    address: '',
  }
  error.value = ''
}

const handlePhoneInput = () => {
  formData.value.phone = formatPhoneNumber(formData.value.phone)
}

// Handle form submission
const handleRegistration = async () => {
  // Validate form before submission
  if (!isFormValid.value) {
    error.value = 'Please fix all errors before submitting'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Attempt to create new user account
    const { error: signUpError } = await authStore.signUp(
      formData.value.email,
      formData.value.password,
      {
        name: formData.value.name,
        surname: formData.value.surname,
        phone_number: formData.value.phone,
        address: formData.value.address,
      },
    )

    if (signUpError) throw signUpError

    // Automatically sign in the user after successful registration
    const { error: signInError } = await authStore.signIn(
      formData.value.email,
      formData.value.password,
    )

    if (signInError) throw signInError

    // Reset the form after successful registration
    resetForm()

    // Display success message using custom event
    window.dispatchEvent(
      new CustomEvent('show-alert', {
        detail: {
          message: 'Registration successful! You are now logged in.',
          type: 'success',
        },
      }),
    )

    // Close dialog and redirect to home page
    emit('close')
    router.push('/') // Or your desired redirect path
  } catch (err) {
    error.value = err.message || 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}

// Watch for dialog closing from parent
watch(
  () => show,
  (newValue) => {
    if (!newValue) {
      resetForm()
      showPassword.value = false
    }
  },
)

// Add close handler
const handleClose = () => {
  resetForm()
  showPassword.value = false
  emit('close')
}

// Function to open login dialog
const openLogin = () => {
  handleClose() // Close the registration dialog first
  emit('open-login') // Emit event to open login dialog
}
</script>
