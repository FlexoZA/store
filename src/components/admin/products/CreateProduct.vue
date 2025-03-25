<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Create New Product</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Product Name -->
          <div>
            <label for="product_name" class="block text-sm font-medium text-gray-700"
              >Product Name</label
            >
            <input
              type="text"
              id="product_name"
              v-model="formData.product_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- SKU -->
          <div>
            <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              id="sku"
              v-model="formData.sku"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">R</span>
              </div>
              <input
                type="number"
                id="price"
                v-model="formData.price"
                step="0.01"
                class="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              v-model="formData.quantity"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              v-model="formData.category_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.category_name }}
              </option>
            </select>
          </div>

          <!-- Featured Product -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              v-model="formData.is_featured"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="is_featured" class="ml-2 block text-sm text-gray-900"
              >Featured Product</label
            >
          </div>

          <!-- Enabled -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              v-model="formData.enabled"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="enabled" class="ml-2 block text-sm text-gray-900">Product Enabled</label>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
          >
            {{ isLoading ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAdminProductStore } from '@/stores/admin/adminProductStore'

export default {
  name: 'CreateProduct',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'created'],
  setup(props, { emit }) {
    const productStore = useAdminProductStore()
    const isLoading = ref(false)
    const categories = ref(productStore.categories)

    // Initialize form data with default values
    const formData = reactive({
      product_name: '',
      sku: '',
      description: '',
      price: 0,
      quantity: 0,
      category_id: null,
      is_featured: false,
      enabled: true,
    })

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      try {
        isLoading.value = true
        const newProduct = await productStore.createProduct({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          category_id: Number(formData.category_id),
        })
        emit('created', newProduct)
        closeModal()
      } catch (error) {
        console.error('Error creating product:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      isLoading,
      categories,
      closeModal,
      handleSubmit,
    }
  },
}
</script>
