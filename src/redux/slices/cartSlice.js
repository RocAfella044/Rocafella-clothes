import { createSlice } from '@reduxjs/toolkit'

const getStorageKey = (userId) => `Rocafella_cart_${userId}`
const GUEST_KEY = 'Rocafella_cart_guest'

const loadCartFromStorage = (userId) => {
  try {
    const key = userId ? getStorageKey(userId) : GUEST_KEY
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const persistCart = (items, userId) => {
  try {
    const key = userId ? getStorageKey(userId) : GUEST_KEY
    localStorage.setItem(key, JSON.stringify(items))
  } catch {}
}

const findLineIndex = (items, id, size) =>
  items.findIndex((item) => item.id === id && item.size === size)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(null), 
    userId: null,
  },
  reducers: {
   
    initCart(state, action) {
      const userId = action.payload
      state.userId = userId
      state.items = loadCartFromStorage(userId)
    },
   
    resetCart(state) {
      state.items = []
      state.userId = null
    },
    addToCart(state, action) {
      const { id, name, price, image, size, quantity = 1 } = action.payload
      const idx = findLineIndex(state.items, id, size)
      if (idx >= 0) {
        state.items[idx].quantity += quantity
      } else {
        state.items.push({ id, name, price, image, size, quantity })
      }
      persistCart(state.items, state.userId)
    },
    removeFromCart(state, action) {
      const { id, size } = action.payload
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      )
      persistCart(state.items, state.userId)
    },
    updateQuantity(state, action) {
      const { id, size, quantity } = action.payload
      const idx = findLineIndex(state.items, id, size)
      if (idx >= 0) state.items[idx].quantity = Math.max(1, quantity)
      persistCart(state.items, state.userId)
    },
    clearCart(state) {
      state.items = []
      persistCart(state.items, state.userId)
    },
  },
})

export const {
  initCart,
  resetCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

export default cartSlice.reducer