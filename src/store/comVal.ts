import { createSlice } from '@reduxjs/toolkit'

interface State {
  // [props: string]: any;
  [key: string]: any
}

const initialState: State = {}

const comValSlice = createSlice({
  name: 'comVal',
  initialState,
  reducers: {
    saveCommonValue(state, action) {
      let pay = action.payload
      let key = pay.key
      state[key] = pay.value
    },
  },
})

export const comValActions = comValSlice.actions
export default comValSlice
