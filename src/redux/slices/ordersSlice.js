import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, fetchOrders } from '../../supabase/userdata'

export const submitOrder = createAsyncThunk(
  'orders/submit',
  async ({ userId, customer, items, total }, { rejectWithValue }) => {
    try { return await createOrder(userId, { customer, items, total }) }
    catch (err) { return rejectWithValue(err.message || 'Could not place your order.') }
  }
)

export const loadOrders = createAsyncThunk(
  'orders/load',
  async (userId, { rejectWithValue }) => {
    try { return await fetchOrders(userId) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { history: [], status: 'idle', error: null, lastOrder: null },
  reducers: {
    resetOrderStatus(state) { state.status = 'idle'; state.error = null; state.lastOrder = null },
    clearOrders(state) { state.history = []; state.status = 'idle'; state.lastOrder = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(submitOrder.fulfilled, (state, action) => { state.status = 'succeeded'; state.lastOrder = action.payload; state.history.unshift(action.payload) })
      .addCase(submitOrder.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Order failed.' })
      .addCase(loadOrders.fulfilled, (state, action) => { state.history = action.payload })
  },
})

export const { resetOrderStatus, clearOrders } = ordersSlice.actions
export const selectOrderHistory = (state) => state.orders.history
export default ordersSlice.reducer