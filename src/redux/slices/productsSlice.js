import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProducts as fetchProductsApi } from '../../supabase/products'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(filters)
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to load products.')
    }
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    category: 'All',
    search: '',
    sort: 'featured',
  },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action) { state.filters.category = action.payload },
    setSearch(state, action) { state.filters.search = action.payload },
    setSort(state, action) { state.filters.sort = action.payload },
    resetFilters(state) { state.filters = initialState.filters },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Something went wrong.' })
  },
})

export const { setCategory, setSearch, setSort, resetFilters } = productsSlice.actions
export default productsSlice.reducer