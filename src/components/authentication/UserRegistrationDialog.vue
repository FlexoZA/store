<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <!-- Change to backdrop-brightness -->
    <div class="absolute inset-0 backdrop-brightness-50 backdrop-blur-sm"></div>

    <!-- Keep existing dialog but make it relative -->
    <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl relative" @click.stop>
      <div class="p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Create your account</h2>

        <form @submit.prevent="handleRegistration" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
          </div>

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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

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

          <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded-md">
            {{ error }}
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Creating account...</span>
              <span v-else>Sign up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/ListerBG.jpg'

const { show } = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const formData = ref({
  email: '',
  password: '',
  name: '',
  surname: '',
  phone: '',
  address: '',
})

const handleRegistration = async () => {
  loading.value = true
  error.value = ''

  try {
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

    // After successful registration, attempt to sign in
    const { error: signInError } = await authStore.signIn(
      formData.value.email,
      formData.value.password,
    )

    if (signInError) throw signInError

    // Show success message using generalAlerts
    window.dispatchEvent(
      new CustomEvent('show-alert', {
        detail: {
          message: 'Registration successful! You are now logged in.',
          type: 'success',
        },
      }),
    )

    emit('close')
    router.push('/') // Or your desired redirect path
  } catch (err) {
    error.value = err.message || 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}
</script>
