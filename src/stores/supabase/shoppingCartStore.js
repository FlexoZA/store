import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useShoppingCartStore = defineStore('shoppingCart', () => {
  // Initialize cart from localStorage if available
  const cartItems = ref(JSON.parse(localStorage.getItem('cartItems')) || [])

  // Watch for changes in cartItems and update localStorage
  watch(
    cartItems,
    (items) => {
      localStorage.setItem('cartItems', JSON.stringify(items))
    },
    { deep: true },
  )

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += product.quantity || 1
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
      })
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    localStorage.removeItem('cartItems')
  }

  // Get cart total
  const getCartTotal = () => {
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.value.reduce((count, item) => {
      return count + item.quantity
    }, 0)
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.value.some((item) => item.id === productId)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  }
})
