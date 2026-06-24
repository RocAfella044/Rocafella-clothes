import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import favoritesReducer from './slices/favoritesSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
  },
})