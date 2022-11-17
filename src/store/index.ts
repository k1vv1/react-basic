import { configureStore } from '@reduxjs/toolkit'
import comValSlice from './comVal'

const store = configureStore({
  reducer: {
    comVal: comValSlice.reducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
