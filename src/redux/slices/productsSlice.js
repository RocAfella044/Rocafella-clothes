import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProducts as fetchProductsApi } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(filters)
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load products.')
    }
  }
)

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filters: {
    category: 'All',
    search: '',
    minPrice: null,
    maxPrice: null,
    sort: 'featured',
  },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.filters.category = action.payload
    },
    setSearch(state, action) {
      state.filters.search = action.payload
    },
    setPriceRange(state, action) {
      state.filters.minPrice = action.payload.min
      state.filters.maxPrice = action.payload.max
    },
    setSort(state, action) {
      state.filters.sort = action.payload
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong.'
      })
  },
})

export const { setCategory, setSearch, setPriceRange, setSort, resetFilters } =
  productsSlice.actions

export default productsSlice.reducer
