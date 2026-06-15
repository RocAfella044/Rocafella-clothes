import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { placeOrder as placeOrderApi } from '../../services/api'

const STORAGE_KEY = 'Rocafella_orders'

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // ignore
  }
}

export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (payload, { rejectWithValue }) => {
    try {
      return await placeOrderApi(payload)
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'We could not place your order. Please try again.'
      )
    }
  }
)

const initialState = {
  history: loadOrders(),
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  lastOrder: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderStatus(state) {
      state.status = 'idle'
      state.error = null
      state.lastOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.lastOrder = action.payload
        state.history.unshift(action.payload)
        persist(state.history)
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Order failed.'
      })
  },
})

export const { resetOrderStatus } = ordersSlice.actions

export const selectOrderHistory = (state) => state.orders.history

export default ordersSlice.reducer
