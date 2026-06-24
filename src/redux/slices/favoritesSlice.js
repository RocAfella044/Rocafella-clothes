import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFavorites, addFavorite, removeFavorite } from '../../supabase/userdata'

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async (userId, { rejectWithValue }) => {
    try { return await fetchFavorites(userId) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggle',
  async ({ userId, productId, isFavorite }, { rejectWithValue }) => {
    try {
      if (isFavorite) await removeFavorite(userId, productId)
      else await addFavorite(userId, productId)
      return { productId, isFavorite }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [], status: 'idle' },
  reducers: {
    clearFavorites(state) { state.ids = []; state.status = 'idle' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => { state.status = 'loading' })
      .addCase(loadFavorites.fulfilled, (state, action) => { state.ids = action.payload; state.status = 'succeeded' })
      .addCase(loadFavorites.rejected, (state) => { state.status = 'failed' })
      // Optimistic toggle
      .addCase(toggleFavoriteAsync.pending, (state, action) => {
        const { productId, isFavorite } = action.meta.arg
        if (isFavorite) state.ids = state.ids.filter((id) => id !== productId)
        else state.ids.push(productId)
      })
      // Roll back on failure
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        const { productId, isFavorite } = action.meta.arg
        if (isFavorite) state.ids.push(productId)
        else state.ids = state.ids.filter((id) => id !== productId)
      })
  },
})

export const { clearFavorites } = favoritesSlice.actions
export const selectFavoriteIds = (state) => state.favorites.ids
export const selectIsFavorite = (id) => (state) => state.favorites.ids.includes(id)
export default favoritesSlice.reducer