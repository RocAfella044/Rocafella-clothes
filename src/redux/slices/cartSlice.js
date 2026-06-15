import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'Rocafella_cart'

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
}

const initialState = {
  items: loadCart(), // { id, name, price, image, size, quantity }
}

const findLineIndex = (items, id, size) =>
  items.findIndex((item) => item.id === id && item.size === size)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, name, price, image, size, quantity = 1 } = action.payload
      const idx = findLineIndex(state.items, id, size)
      if (idx >= 0) {
        state.items[idx].quantity += quantity
      } else {
        state.items.push({ id, name, price, image, size, quantity })
      }
      persist(state.items)
    },
    removeFromCart(state, action) {
      const { id, size } = action.payload
      state.items = state.items.filter((item) => !(item.id === id && item.size === size))
      persist(state.items)
    },
    updateQuantity(state, action) {
      const { id, size, quantity } = action.payload
      const idx = findLineIndex(state.items, id, size)
      if (idx >= 0) {
        state.items[idx].quantity = Math.max(1, quantity)
      }
      persist(state.items)
    },
    clearCart(state) {
      state.items = []
      persist(state.items)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

export default cartSlice.reducer
