import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'Rocafella_favorites'

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

const initialState = {
  ids: loadFavorites(), // array of product ids
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((favId) => favId !== id)
      } else {
        state.ids.push(id)
      }
      persist(state.ids)
    },
    clearFavorites(state) {
      state.ids = []
      persist(state.ids)
    },
  },
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions

export const selectFavoriteIds = (state) => state.favorites.ids
export const selectIsFavorite = (id) => (state) => state.favorites.ids.includes(id)

export default favoritesSlice.reducer
